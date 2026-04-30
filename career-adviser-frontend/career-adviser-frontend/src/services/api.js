import axios from 'axios';

const API_BASE = '/api/career';

export const careerAPI = {
  async getAdvice(data) {
    const response = await axios.post(`${API_BASE}/advise`, data, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    });
    return response.data;
  },

  async getStreams() {
    const response = await axios.get(`${API_BASE}/streams`);
    return response.data;
  },

  async healthCheck() {
    const response = await axios.get(`${API_BASE}/health`);
    return response.data;
  }
};

export const STREAM_SUBJECTS = {
  'Science-PCM': ['Physics', 'Chemistry', 'Mathematics', 'English', 'Computer Science', 'Physical Education'],
  'Science-PCB': ['Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'Physical Education'],
  'Science-PCMB': ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'],
  'Commerce': ['Accountancy', 'Business Studies', 'Economics', 'English', 'Second Language'],
  'Commerce-Maths': ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English'],
  'Arts': ['History', 'Geography', 'Political Science', 'Sociology', 'English', 'Second Language'],
  'Arts-Psychology': ['History', 'Geography', 'Psychology', 'Sociology', 'English', 'Second Language'],
};

export const POPULAR_CAREERS = [
  'Software Engineer / Developer',
  'Doctor (MBBS / MD)',
  'IAS / IPS / Civil Services Officer',
  'Chartered Accountant (CA)',
  'Lawyer / Advocate',
  'Mechanical Engineer',
  'Data Scientist / AI Engineer',
  'Civil Engineer',
  'Architect',
  'Defence Officer (Army / Navy / Air Force)',
  'Teacher / Professor',
  'Nurse / Healthcare Professional',
  'Entrepreneur / Business Owner',
  'Pharmacist',
  'Fashion / Interior Designer',
  'Journalist / Media Professional',
  'Psychologist / Counsellor',
  'Banker / Financial Analyst',
  'Pilot / Aviation',
  'Other (type below)',
];
