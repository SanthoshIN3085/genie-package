import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Your datasets

const datasets = {
  faqs: [
    {
      content: "What is Genie by Resul?",
      details: `Genie is your <span class='font-poppins-bold'>trusted AI assistant for real-time audience engagement</span> — designed to help you create, personalize, and maximize the impact of your communications, all from a single platform.`,
    },
    {
      content: "How does Genie help me improve my campaigns?",
      details:
        "Genie assists you by analyzing customer data, suggesting tailored messages, optimizing delivery schedules, and automating routines — freeing up your team’s time while increasing engagement.",
    },
    {
      content: "What kind of personalization can I do with Genie?",
      details: `Yes — you can <span class='font-poppins-bold'>design, execute, and track multichannel journeys</span> in a unified platform, ensuring a consistent and connected customer experience across all communication streams.`,
    },
    {
      content: "Does Genie enable multichannel orchestration?",
      details:
        "Yes — you can design, execute, and track multichannel journeys in a unified platform, ensuring a consistent and connected customer experience across all communication streams.",
    },
    {
      content: "Is Genie compliant with data regulations?",
      details:
        "Yes — Genie is designed to handle customer data safely and in compliance with regulations like GDPR, CCPA, and other data protection standards.",
    },
    {
      content: "Do I need technical skills to use Genie?",
      details: `No — Genie is designed with marketers in mind, offering a simple and flexible platform that lets you <span class='font-poppins-bold'>build sophisticated campaigns with ease</span>.`,
    },
    {
      content: "What kind of support is available if I need help?",
      details: `We provide extensive <span class='font-poppins-bold'>support via email, phone, and chat</span>, along with a comprehensive knowledge base of articles and guides.`,
    },
  ],
  limitations: [
    {
      id: 1,
      title: "Access sensitive data without controls",
      details: [
        "Cannot access private/sensitive user data unless explicitly authorized and encrypted.",
        "Does not bypass role-based access controls or authentication mechanisms.",
      ],
    },
    {
      id: 2,
      title: "Act outside its scope",
      details: [
        "Cannot autonomously update critical systems (e.g., production deployments, payment systems) without explicit permission.",
        "Won't make legal, medical, or financial decisions without human verification.",
      ],
    },
    {
      id: 3,
      title: "Guarantee 100% accuracy",
      details: [
        {
          label: "May produce incorrect or outdated information if:",
          subDetails: [
            "Relying on out-of-sync data sources",
            "Operating with incomplete knowledge bases",
            "Interpreting ambiguous natural language",
          ],
        },
      ],
    },
    {
      id: 4,
      title: "Replace human judgment",
      details: [
        {
          label: "Not a substitute for:",
          subDetails: [
            "Strategic decision-making",
            "Ethical reasoning",
            "Situational awareness in crises",
          ],
        },
        "Final decisions should involve human oversight.",
      ],
    },
    {
      id: 5,
      title: "Operate without guardrails",
      details: [
        {
          label: "Bound by limits like:",
          subDetails: [
            "Token/usage caps",
            "Rate limits on APIs/tools",
            "Governance policies (e.g., data residency, fairness rules)",
          ],
        },
      ],
    },
    {
      id: 6,
      title: "Engage in inappropriate behavior",
      details: [
        {
          label: "Programmatically restricted from:",
          subDetails: [
            "Generating harmful or discriminatory content",
            "Creating or spreading misinformation",
            "Engaging in manipulation, coercion, or bias",
          ],
        },
      ],
    },
    {
      id: 7,
      title: "Real-time decision-making in safety-critical systems",
      details: [
        {
          label: "Not designed for real-time control of:",
          subDetails: [
            "Industrial machinery",
            "Autonomous vehicles",
            "Medical equipment",
          ],
        },
      ],
    },
  ],
  capabilities: [
    {
      id: 1,
      title: "Autonomous task execution",
      details: [
        "Execute multi-step workflows based on prompts.",
        "Act independently using pre-configured goals, parameters, and tools.",
        "Adapt decisions within predefined safe limits (e.g., data cleanup, report generation).",
      ],
    },
    {
      id: 2,
      title: "Multi-agent collaboration",
      details: [
        "Coordinate actions across multiple agents toward shared objectives.",
        "Share state/context between agents for seamless delegation.",
      ],
    },
    {
      id: 3,
      title: "Context awareness",
      details: [
        "Retain session-specific memory during a task or session (if configured).",
        "Use context from APIs, databases, documents, and tools integrated into its environment.",
      ],
    },
    {
      id: 4,
      title: "Tool and API integration",
      details: [
        "Invoke third-party tools or APIs autonomously (email, CRM, code repos, ticket systems).",
        "Access structured or semi-structured data for operations (if permitted).",
      ],
    },
    {
      id: 5,
      title: "Reasoning and planning",
      details: [
        "Prioritize tasks based on goal trees or agent architectures.",
        "Simulate multiple action paths and pick optimal ones within constraints.",
      ],
    },
    {
      id: 6,
      title: "Natural language understanding",
      details: [
        "Understand complex instructions in natural language.",
        "Generate coherent responses and documentation as part of its process.",
      ],
    },
    {
      id: 7,
      title: "Self-monitoring and logging",
      details: [
        "Maintain action logs for traceability and audit.",
        "Flag anomalies, failures, or unexpected tool responses.",
      ],
    },
  ],
};

// Configuration
const PASSWORD = "genye"; // Your provided key
const ITERATIONS = 600000; // PBKDF2 iterations
const OUTPUT_DIR = path.join(__dirname, "encrypted_data");

// Main encryption function
const encryptDatasets = async () => {
  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR);
    }

    // Encrypt each dataset separately
    for (const [name, data] of Object.entries(datasets)) {
      const datasetDir = path.join(OUTPUT_DIR, name);

      // Create dataset directory
      if (!fs.existsSync(datasetDir)) {
        fs.mkdirSync(datasetDir);
      }

      // Generate random salt (16 bytes)
      const salt = crypto.randomBytes(16);

      // Generate random IV (12 bytes for AES-GCM)
      const iv = crypto.randomBytes(12);

      // Derive key using PBKDF2
      const key = crypto.pbkdf2Sync(
        PASSWORD,
        salt,
        ITERATIONS,
        32, // 32 bytes = 256 bits
        "sha256"
      );

      // Create cipher
      const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

      // Encrypt the data
      const jsonData = JSON.stringify(data);
      let encrypted = cipher.update(jsonData, "utf8", "hex");
      encrypted += cipher.final("hex");
      const authTag = cipher.getAuthTag().toString("hex");

      // Prepare output
      const output = {
        name,
        encryptedData: encrypted,
        iv: iv.toString("hex"),
        salt: salt.toString("hex"),
        authTag,
        algorithm: "aes-256-gcm",
        keyDerivation: {
          algorithm: "PBKDF2",
          iterations: ITERATIONS,
          hash: "SHA-256",
        },
        timestamp: new Date().toISOString(),
      };

      // Write files
      fs.writeFileSync(
        path.join(datasetDir, "encrypted.json"),
        JSON.stringify(output, null, 2)
      );
      fs.writeFileSync(path.join(datasetDir, "salt.txt"), salt.toString("hex"));
      fs.writeFileSync(path.join(datasetDir, "iv.txt"), iv.toString("hex"));

      console.log(`Successfully encrypted ${name} dataset`);
    }

    console.log("All datasets encrypted successfully!");
  } catch (error) {
    console.error("Encryption failed:", error);
  }
};


// Run the encryption
encryptDatasets();
