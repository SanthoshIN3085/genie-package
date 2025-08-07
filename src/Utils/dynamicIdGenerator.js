// Dynamic ID Generator for Chat Messages
// User messages: even numbers (690, 692, 694...)
// Genie messages: odd numbers (691, 693, 695...)

class DynamicIdGenerator {
  constructor() {
    this.baseId = 690; // Starting ID
    this.currentUserId = this.baseId; // Even numbers for user
    this.currentGenieId = this.baseId + 1; // Odd numbers for genie
  }

  // Generate ID for user message
  generateUserId() {
    const id = this.currentUserId;
    this.currentUserId += 2; // Increment by 2 to keep even numbers
    return id;
  }

  // Generate ID for genie message
  generateGenieId() {
    const id = this.currentGenieId;
    this.currentGenieId += 2; // Increment by 2 to keep odd numbers
    return id;
  }

  // Initialize from existing messages to ensure correct sequence
  initializeFromMessages(messages) {
    if (!messages || messages.length === 0) {
      this.reset();
      return;
    }

    // Find the highest ID in existing messages
    const maxId = Math.max(...messages.map(msg => msg.id));
    
    // Set the next IDs based on the highest existing ID
    if (maxId % 2 === 0) {
      // Last message was user (even), next user should be maxId + 2, next genie should be maxId + 1
      this.currentUserId = maxId + 2;
      this.currentGenieId = maxId + 1;
    } else {
      // Last message was genie (odd), next genie should be maxId + 2, next user should be maxId + 1
      this.currentGenieId = maxId + 2;
      this.currentUserId = maxId + 1;
    }
  }

  // Reset the generator (useful for new chat sessions)
  reset() {
    this.currentUserId = this.baseId;
    this.currentGenieId = this.baseId + 1;
  }

  // Set custom starting ID
  setBaseId(baseId) {
    this.baseId = baseId;
    this.currentUserId = baseId;
    this.currentGenieId = baseId + 1;
  }

  // Get current state
  getCurrentState() {
    return {
      baseId: this.baseId,
      currentUserId: this.currentUserId,
      currentGenieId: this.currentGenieId
    };
  }
}

// Create singleton instance
const idGenerator = new DynamicIdGenerator();

export default idGenerator; 