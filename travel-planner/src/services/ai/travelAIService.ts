import { FormInput } from '../../models/FormInput';
import { TravelPlan } from '../../models/TravelPlan';
import { PlanSource } from '../../models/Enums';
import { generateContent } from '../geminiService';

// Mock data generator for local testing
export async function generateTravelPlan(input: FormInput): Promise<TravelPlan> {
  console.log('Generating mock travel plan for:', input);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Calculate dates between start and end dates
  const startDate = new Date(input.startDate);
  const endDate = new Date(input.endDate);
  const dayDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Generate mock days
  const days = [];
  for (let i = 0; i < dayDiff; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    days.push({
      date: date.toISOString().split('T')[0],
      weather: getRandomWeather(),
      activities: generateActivities(input.interests, 3),
      notes: `Enjoy your day in ${input.destination}!`
    });
  }

  return {
    id: 'mock-' + Date.now(),
    title: `Trip to ${input.destination}`,
    preference: input,
    plan: days,
    createdAt: new Date().toISOString(),
    isEditable: true,
    source: PlanSource.Generated
  };
}

// Helper functions for mock data
function getRandomWeather() {
  const weathers = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Clear Skies'];
  return weathers[Math.floor(Math.random() * weathers.length)];
}

function generateActivities(interests: any[], count: number) {
  const activities = [
    {
      title: 'Visit Local Museum',
      time: '10:00 AM',
      location: 'Central Museum',
      notes: 'Explore the local history and culture through fascinating exhibits.'
    },
    {
      title: 'Lunch at Famous Restaurant',
      time: '1:00 PM',
      location: 'Downtown Restaurant',
      notes: 'Enjoy local cuisine and specialties.'
    },
    {
      title: 'Explore City Center',
      time: '3:00 PM',
      location: 'Main Square',
      notes: 'Walk around the historic city center and enjoy the architecture.'
    },
    {
      title: 'Sunset at Viewpoint',
      time: '6:30 PM',
      location: 'Hilltop Viewpoint',
      notes: 'Watch the beautiful sunset over the city.'
    },
    {
      title: 'Dinner and Entertainment',
      time: '8:00 PM',
      location: 'Entertainment District',
      notes: 'Enjoy local food and entertainment venues.'
    }
  ];
  
  // Shuffle and return a subset
  return shuffleArray(activities).slice(0, count);
}

function shuffleArray(array: any[]) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export async function generateTravelPlanFromGemini(input: FormInput): Promise<TravelPlan> {
  // 1) Build the prompt as an array of lines to avoid any truncation
  const promptLines = [
    'You are a professional travel assistant.',
    'Given the following trip details, produce a day-by-day itinerary in valid JSON only.',
    '',
    'Requirements:',
    '- Top-level object with a single key "days" (an array).',
    '- Each element in "days" must include:',
    '  • "date": in YYYY-MM-DD format',
    '  • "activities": an array of 2–5 brief activity descriptions.',
    '- NO extra commentary, markdown or keys—output must parse as JSON.',
    '',
    'Trip Details:',
    `- Origin city: ${input.originCity}`,
    `- Destination city: ${input.destinationCity}`,
    `- Dates: ${input.startDate} to ${input.endDate}`,
    `- Interests: ${input.interests.join(', ')}`,
    '',
    'Respond with the JSON object and nothing else.',
  ];

  // 2) Join into a single string
  const prompt = promptLines.join('\n');

  // 3) (For debugging) log the complete prompt so you can inspect it in the browser console
  console.log('Full prompt to Gemini:\n', prompt);

  // 4) Call the Netlify function → Gemini
  const raw = await generateContent(prompt, 1200);

  // 5) Parse Gemini's JSON response
  const parsed = JSON.parse(raw);

  // 6) Map into your TravelPlan model
  return {
    id: `gen-${Date.now()}`,
    source: 'generated',
    createdAt: new Date().toISOString(),
    isEditable: false,
    days: parsed.days.map((d: any) => ({
      date: d.date,
      activities: d.activities,
    })),
  };
} 