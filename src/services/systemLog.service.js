import axios from "./axios.config";

const systemLogService = {
    getLogs: (page = 0) =>
        axios.get(`/system-logs?page=${page}`).then(res => res.data),

    getLogDetail: (logId) =>
        axios.get(`/system-logs/${logId}`).then(res => res.data),
};

export default systemLogService;

