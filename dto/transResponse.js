// DTO
class transResponse {
    constructor(trans) {
      this.id = trans.id
      this.user_id = trans.user_id;
      this.date_time = trans.date_time;
      this.type = trans.type;
      this.fromTo = trans.fromTo;
      this.description = trans.description;
      this.amount = trans.amount;
    }
  }
  
  module.exports = { transResponse };