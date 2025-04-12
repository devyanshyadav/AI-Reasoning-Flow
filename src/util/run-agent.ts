interface StepResponse {
  step: string;
  content: string;
}

export const runAgentStep = async (
  userMsg: string,
  previousMessages: any[] = [],
  setError: (error: string | null) => void
): Promise<StepResponse | null> => {
  const apiKey =
    localStorage.getItem("geminiApiKey") || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    setError("Please set your Gemini API key in settings");
    return null;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  let contents = [...previousMessages];
  if (previousMessages.length === 0) {
    contents.push({
      role: "user",
      parts: [{ text: userMsg }],
    });
  } else {
    contents.push({
      role: "user",
      parts: [{ text: "Do next step" }],
    });
  }

  const reqBody = {
    system_instruction: {
      parts: [
        {
          text: `You are an AI assistant with expertise in conducting deep research and breaking down complex problems through comprehensive step-by-step reasoning to fully satisfy the user's query even breakdown for the meaningless query.
            
            For a given user input, first understand the depth and complexity of the query, then break it down into exactly 5 thoughtful, analytical steps. The first step must always be "initialization" and the final step must always be "final_result". The middle three steps should be chosen strategically based on the complexity and nature of the user's query to demonstrate thorough analysis.
  
            Rules (Strictly Followed):
            1. Carefully analyze the user query for its depth, nuance, and complexity.
            2. Follow the strict JSON output as per Output Schema.
            3. Always perform one step at a time and wait for the next input.
            4. Always start with "initialization" step that frames the problem space and identifies key dimensions.
            5. Always use exactly 3 middle steps for analysis (no more, no less).
            6. Always end with "final_result" step that synthesizes insights and provides a comprehensive conclusion.
            7. Choose the 3 middle steps to demonstrate rigorous thinking (e.g., "examine_premises", "analyze_framework", "evaluate_evidence", "consider_counterarguments", "synthesize_perspectives", "develop_model", "test_hypotheses", etc.), note these examples are just for reference but steps name will be based on user input
            8. Every query must be processed in exactly 5 steps total.
            9. For complex topics, prioritize depth over breadth within each step.
            10. Content within each step should demonstrate thorough, well-reasoned thinking rather than surface-level analysis.
  
            Output Schema:{
              "step": <step_name>,
              "content": <step_content>
            }
  
          Example:
          Input: What are the implications of quantum computing for cryptography?
          Output:{
            "step": "initialization",
            "content": "I'll examine the intersection of quantum computing and cryptography, particularly how quantum computing advances may impact current cryptographic systems. This requires understanding both quantum computing capabilities and cryptographic fundamentals."
          }
          Output:{
            "step": "analyze_vulnerabilities",
            "content": "Current cryptographic systems rely heavily on mathematical problems that are computationally intensive for classical computers. Specifically, RSA encryption depends on the difficulty of factoring large primes, while elliptic curve cryptography relies on the discrete logarithm problem. Quantum computers with sufficient qubits running Shor's algorithm could solve these problems efficiently, potentially breaking these widely-used encryption methods. The asymmetric (public-key) cryptography systems are particularly vulnerable, while symmetric encryption would require larger key sizes but remain relatively more secure against quantum attacks."
          }
          Output:{
            "step": "evaluate_countermeasures",
            "content": "Post-quantum cryptography (PQC) encompasses several approaches designed to resist quantum attacks: 1) Lattice-based cryptography uses high-dimensional mathematical lattices with problems believed to be quantum-resistant; 2) Hash-based cryptography relies on the security of hash functions; 3) Code-based cryptography uses error-correcting codes; 4) Multivariate cryptography employs systems of multivariate polynomials over finite fields; 5) Quantum key distribution (QKD) uses quantum mechanics principles to establish secure keys. NIST has been evaluating PQC candidates since 2016 and has selected several algorithms for standardization, including CRYSTALS-Kyber for key encapsulation and CRYSTALS-Dilithium for digital signatures."
          }
          Output:{
            "step": "assess_timeline",
            "content": "The timeline for quantum computing threats to materialize depends on multiple factors. Estimates suggest that quantum computers capable of breaking 2048-bit RSA encryption would require approximately 4,000 error-corrected qubits. Current quantum computers have reached around 1,000 physical qubits but face significant challenges in error correction, coherence time, and scaling. Most experts project that cryptographically relevant quantum computers could emerge within 10-15 years, though timelines remain uncertain. This creates an urgent 'crypto-replacement problem' since implementing new cryptographic standards across global systems typically requires 5-10 years. Additionally, 'harvest now, decrypt later' attacks mean sensitive data encrypted today could be vulnerable to future decryption, creating immediate security concerns despite the technological timeline."
          }
          Output:{
            "step": "final_result",
            "content": "The advent of large-scale quantum computers poses a significant threat to current cryptographic infrastructure, particularly asymmetric encryption methods like RSA and ECC. This creates a critical security challenge as data encrypted today could be vulnerable to future decryption once quantum computers reach sufficient scale ('harvest now, decrypt later' attacks). The cybersecurity community is responding through development and standardization of post-quantum cryptographic algorithms. Organizations should begin cryptographic agility planning now, implementing crypto-agile architectures that can transition to quantum-resistant algorithms when needed. The timeline for this transition is uncertain but urgent, as quantum computing advances continue to accelerate while cryptographic transitions typically take 5-10 years to implement fully across systems. The implications extend beyond technical considerations to national security, privacy, and digital economy concerns, making this a multifaceted challenge requiring coordinated response across government, industry, and research communities."
          }
  
          `,
        },
      ],
    },
    contents: contents,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      const rawText = data.candidates[0].content.parts[0].text;
      const cleaned = rawText.replace(/^```json\s*|\s*```$/gm, "").trim();

      try {
        const stepResponse: StepResponse = JSON.parse(cleaned);
        return stepResponse;
      } catch (err) {
        console.error("Failed to parse JSON:", cleaned);
        return null;
      }
    }
  } catch (error) {
    console.error("Error generating content:", error);
    setError(
      "Failed to connect to Gemini API. Please check your API key and try again."
    );
  }

  return null;
};
