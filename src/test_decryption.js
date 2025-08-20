import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PASSWORD = "genye"; // Your provided key
const ITERATIONS = 600000; // PBKDF2 iterations
const OUTPUT_DIR = path.join(__dirname, "encrypted_data");

// Decryption function
const decryptDataset = async (datasetName) => {
  try {
    const datasetDir = path.join(OUTPUT_DIR, datasetName);
    const encryptedFilePath = path.join(datasetDir, "encrypted.json");
    
    // Check if encrypted file exists
    if (!fs.existsSync(encryptedFilePath)) {
      throw new Error(`Encrypted file not found for dataset: ${datasetName}`);
    }

    // Read the encrypted data
    const encryptedData = JSON.parse(fs.readFileSync(encryptedFilePath, "utf8"));
    
    // Extract encryption parameters
    const { encryptedData: encrypted, iv, salt, authTag, keyDerivation } = encryptedData;
    
    // Verify key derivation parameters match
    if (keyDerivation.algorithm !== "PBKDF2" || 
        keyDerivation.iterations !== ITERATIONS || 
        keyDerivation.hash !== "SHA-256") {
      throw new Error("Key derivation parameters mismatch");
    }

    // Convert hex strings back to buffers
    const ivBuffer = Buffer.from(iv, "hex");
    const saltBuffer = Buffer.from(salt, "hex");
    const authTagBuffer = Buffer.from(authTag, "hex");
    const encryptedBuffer = Buffer.from(encrypted, "hex");

    // Derive the same key using PBKDF2
    const key = crypto.pbkdf2Sync(
      PASSWORD,
      saltBuffer,
      ITERATIONS,
      32, // 32 bytes = 256 bits
      "sha256"
    );

    // Create decipher
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, ivBuffer);
    decipher.setAuthTag(authTagBuffer);

    // Decrypt the data
    let decrypted = decipher.update(encryptedBuffer, null, "utf8");
    decrypted += decipher.final("utf8");

    // Parse the decrypted JSON
    const originalData = JSON.parse(decrypted);
    
    console.log(`Successfully decrypted ${datasetName} dataset`);
    return originalData;
    
  } catch (error) {
    console.error(`Decryption failed for ${datasetName}:`, error.message);
    throw error;
  }
};

// Function to decrypt all datasets
const decryptAllDatasets = async () => {
  try {
    const decryptedData = {};
    const datasetNames = ["faqs", "limitations", "capabilities"];
    
    for (const datasetName of datasetNames) {
      const data = await decryptDataset(datasetName);
      decryptedData[datasetName] = data;
    }
    
    console.log("All datasets decrypted successfully!");
    return decryptedData;
    
  } catch (error) {
    console.error("Decryption failed:", error);
    throw error;
  }
};

// Export functions for use in other modules
export { decryptDataset, decryptAllDatasets };

// Example usage functions
const decryptSingleDataset = async () => {
  try {
    console.log("Decrypting FAQs dataset...\n");
    const faqsData = await decryptDataset("faqs");
    console.log("Decrypted FAQs data:", JSON.stringify(faqsData, null, 2));
  } catch (error) {
    console.error("Failed to decrypt FAQs:", error);
  }
};

const decryptAllAndShowSummary = async () => {
  try {
    console.log("Decrypting all datasets...\n");
    const allData = await decryptAllDatasets();
    
    console.log("\n=== Decryption Summary ===");
    console.log(`FAQs count: ${allData.faqs.length}`);
    console.log(`Limitations count: ${allData.limitations.length}`);
    console.log(`Capabilities count: ${allData.capabilities.length}`);
    
    console.log("\n✅ All datasets decrypted successfully!");
    return allData;
  } catch (error) {
    console.error("❌ Failed to decrypt all datasets:", error);
  }
};

// Run decryption if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  decryptAllAndShowSummary();
}