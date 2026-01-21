const API_BASE_URL = 'http://localhost:5000/api';

const StudentRecordService = {
    async getRecords(category) {
        const response = await fetch(`${API_BASE_URL}/student-records?category=${category}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch student records');
        }

        const resData = await response.json();
        return resData.data;
    }
};

export default StudentRecordService;
