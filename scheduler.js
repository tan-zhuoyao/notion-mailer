class Scheduler {
  constructor() {
    this.scheduledJobs = {};
  }

  getJobs() {
    return this.scheduledJobs;
  }

  addJob(id, job) {
    this.scheduledJobs[id] = job;
  }

  deleteJob(id) {
    delete this.scheduledJobs[id];
  }
  
  containsJob(id) {
    return !!this.scheduledJobs[id];
  }

  rescheduleJob(id, date) {
    if (!this.scheduledJobs[id]) return
    this.scheduledJobs[id].reschedule(date);
  }
}

export default Scheduler;