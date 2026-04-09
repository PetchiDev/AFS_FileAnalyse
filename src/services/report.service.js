
import axios from 'axios';

// Mock function to simulate API call
export const fetchShareLink = async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return mock data
    return {
        link: 'https://afs.company.com/report/abc-company-compliance-analysis'
    };
};

// In a real scenario, this would use axios:
// export const fetchShareLink = async (reportId) => {
//   const response = await axios.get(\`/api/reports/\${reportId}/share-link\`);
//   return response.data;
// };
