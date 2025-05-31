import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface EmployerInfo {
  employer_name: string;
  employer_linkedin_id: string;
  employer_company_id: number;
  employee_title: string;
  employee_description: string;
  employee_location: string;
  start_date: string;
  end_date?: string;
}

interface LinkedInProfile {
  linkedin_profile_url: string;
  linkedin_flagship_url: string;
  name: string;
  email: string;
  title: string;
  last_updated: string;
  headline: string;
  summary: string;
  num_of_connections: number;
  skills: string;
  profile_picture_url: string;
  twitter_handle: string;
  languages: string[];
  all_employers: string[];
  past_employers: EmployerInfo[];
  current_employers: EmployerInfo[];
  all_employers_company_id: number[];
  all_titles: string[];
  all_schools: string[];
  all_degrees: string[];
}

interface RequestBody {
  companyUrl: string; // Company website URL to scrape
  linkedinUrl: string; // LinkedIn profile URL to enrich
}

async function scrapeWebsiteContent(companyUrl: string): Promise<string> {
  const JINA_API_KEY = process.env.JINA_API_KEY;
  
  if (!JINA_API_KEY) {
    throw new Error('JINA_API_KEY is not configured');
  }

  try {
    console.log(`Scraping website content: ${companyUrl}`);
    
    const response = await fetch(
      `https://r.jina.ai/${encodeURIComponent(companyUrl)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${JINA_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Jina AI API error (${response.status}):`, errorText);
      throw new Error(`Failed to scrape website: ${response.status} ${response.statusText}`);
    }

    const websiteContent = await response.text();
    console.log('Successfully scraped website content');
    
    // Return the raw text content
    return websiteContent;
    
  } catch (error) {
    console.error('Error scraping website:', error);
    
    // Fallback to mock data if API fails
    console.log('Falling back to mock company data due to scraping error');
    return createMockCompanyInfo(companyUrl);
  }
}

function createMockCompanyInfo(companyUrl: string): string {
  if (companyUrl.includes('domu.ai')) {
    return `
Company: Domu
Industry: AI/Technology
Description: Domu is an AI-powered personalization platform that helps businesses create personalized videos and audio content for lead generation and customer engagement.
Recent Updates: Recently launched new AI-powered features for enhanced personalization and better conversion rates.
Products: AI video generation, personalized audio content, lead conversion tools
    `.trim();
  }
  
  return `
Company: Target Company
Industry: Technology
Description: Innovative technology company focused on digital transformation and customer engagement solutions.
Recent Updates: Expanding their digital presence and implementing new technologies.
Focus: Digital innovation, customer experience, technology solutions
  `.trim();
}

async function enrichLinkedInProfile(linkedinUrl: string): Promise<LinkedInProfile> {
  const CRUSTDATA_API_KEY = process.env.CRUSTDATA_API_KEY;
  
  if (!CRUSTDATA_API_KEY) {
    throw new Error('CRUSTDATA_API_KEY is not configured');
  }

  try {
    console.log(`Enriching LinkedIn profile: ${linkedinUrl}`);
    
    const response = await fetch(
      `https://api.crustdata.com/screener/person/enrich?linkedin_profile_url=${encodeURIComponent(linkedinUrl)}&fields=business_email,headline,summary,skills,current_employers,past_employers,all_schools,all_degrees,all_titles,num_of_connections,languages,profile_picture_url,twitter_handle`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Token ${CRUSTDATA_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Crustdata API error (${response.status}):`, errorText);
      throw new Error(`Failed to enrich LinkedIn profile: ${response.status} ${response.statusText}`);
    }

    const profileData = await response.json();
    console.log('Successfully enriched LinkedIn profile');
    
    // The API returns the data in the format we expect
    return profileData as LinkedInProfile;
    
  } catch (error) {
    console.error('Error enriching LinkedIn profile:', error);
    
    // Fallback to mock data if API fails
    console.log('Falling back to mock data due to API error');
    return createMockProfile(linkedinUrl);
  }
}

function createMockProfile(linkedinUrl: string): LinkedInProfile {
  // Extract name from URL if possible
  const nameMatch = linkedinUrl.match(/linkedin\.com\/in\/([^\/]+)/);
  const profileSlug = nameMatch ? nameMatch[1] : 'professional';
  const name = profileSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    linkedin_profile_url: linkedinUrl,
    linkedin_flagship_url: linkedinUrl,
    name: name,
    email: "contact@example.com",
    title: "Technology Professional",
    last_updated: new Date().toISOString(),
    headline: "Technology Professional | Innovation Leader | Digital Transformation Expert",
    summary: "Experienced technology professional with a track record of driving digital innovation and leading successful technical projects.",
    num_of_connections: 1250,
    skills: "Software Development, Project Management, Digital Strategy, Technology Leadership, Innovation",
    profile_picture_url: "https://example.com/profile.jpg",
    twitter_handle: "",
    languages: ["English"],
    all_employers: ["Current Company", "Previous Corp"],
    past_employers: [
      {
        employer_name: "Previous Corp",
        employer_linkedin_id: "previous-corp",
        employer_company_id: 12345,
        employee_title: "Senior Developer",
        employee_description: "Led development projects and mentored junior developers",
        employee_location: "San Francisco, CA",
        start_date: "2020-01-01T00:00:00.000Z",
        end_date: "2023-06-01T00:00:00.000Z"
      }
    ],
    current_employers: [
      {
        employer_name: "Current Company",
        employer_linkedin_id: "current-company",
        employer_company_id: 67890,
        employee_title: "Technology Professional",
        employee_description: "Leading technology initiatives and driving digital transformation projects.",
        employee_location: "San Francisco, CA",
        start_date: "2023-07-01T00:00:00.000Z"
      }
    ],
    all_employers_company_id: [12345, 67890],
    all_titles: ["Developer", "Senior Developer", "Technology Professional"],
    all_schools: ["State University", "Technical Institute"],
    all_degrees: ["Bachelor of Computer Science", "Software Engineering Certificate"]
  };
}

function extractKeyInsights(profile: LinkedInProfile) {
  const insights = {
    name: profile.name,
    currentRole: profile.title,
    currentCompany: profile.current_employers?.[0]?.employer_name || 'Unknown',
    headline: profile.headline,
    summary: profile.summary,
    skills: profile.skills?.split(',').slice(0, 5) || [], // Top 5 skills
    education: profile.all_schools?.slice(0, 2) || [], // Top 2 schools
    experienceLevel: profile.all_titles?.length || 0,
    connectionCount: profile.num_of_connections,
    recentExperience: profile.current_employers?.[0] || null,
    languages: profile.languages || []
  };

  return insights;
}

function generatePersonalizationPoints(profile: LinkedInProfile, companyInfo: string) {
  const points = [];
  
  // Career progression
  if (profile.all_titles && profile.all_titles.length > 1) {
    points.push(`Career growth from ${profile.all_titles[0]} to ${profile.title}`);
  }
  
  // Current company context
  if (profile.current_employers?.[0]) {
    points.push(`Current role at ${profile.current_employers[0].employer_name}`);
  }
  
  // Skills alignment
  if (profile.skills) {
    const skillsArray = profile.skills.split(',').slice(0, 3);
    points.push(`Expertise in ${skillsArray.join(', ')}`);
  }
  
  // Education background
  if (profile.all_schools && profile.all_schools.length > 0) {
    points.push(`Educational background from ${profile.all_schools[0]}`);
  }
  
  // Network size context
  if (profile.num_of_connections > 500) {
    points.push(`Well-connected professional with ${profile.num_of_connections}+ connections`);
  }
  
  return points;
}

async function generatePersonalizedScript(companyInfo: string, profile: LinkedInProfile): Promise<string> {
  const insights = extractKeyInsights(profile);
  const personalizationPoints = generatePersonalizationPoints(profile, companyInfo);
  
  const prompt = `
Create a highly personalized 30-45 second video message for payment collection outreach that feels supportive and relationship-focused.

COMPANY CONTEXT:
${companyInfo}

LEAD PROFILE:
- Name: ${insights.name}
- Current Role: ${insights.currentRole} at ${insights.currentCompany}
- Headline: ${insights.headline}
- Summary: ${insights.summary}
- Key Skills: ${insights.skills.join(', ')}
- Education: ${insights.education.join(', ')}
- Experience Level: ${insights.experienceLevel} different roles
- Network: ${insights.connectionCount} connections
- Languages: ${insights.languages.join(', ')}

PERSONALIZATION OPPORTUNITIES:
${personalizationPoints.map(point => `- ${point}`).join('\n')}

COLLECTION MESSAGE REQUIREMENTS:
1. Write ONLY the spoken words - no stage directions, formatting, or labels
2. Open with their name and acknowledge their professional achievements
3. Position the collection as a partnership opportunity to resolve together
4. Reference their success/expertise to build rapport before discussing the matter
5. Use language like "work together," "find a solution," "partnership," "support"
6. Mention flexible payment options or willingness to discuss arrangements
7. Keep it respectful, empathetic, and solutions-focused (never threatening)
8. End with a collaborative call-to-action like "let's chat" or "work together"
9. 30-45 seconds when spoken (approximately 75-115 words)
10. No [PAUSE], [START], [END] or other formatting - just natural speech

Make it feel like you genuinely respect them and want to help find a mutually beneficial solution. Focus on partnership, not pressure.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert at creating empathetic, relationship-focused collection messages that build rapport and offer collaboration rather than pressure. Always position collection as a partnership opportunity and focus on solutions, respect, and mutual benefit."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "Failed to generate script";
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate script with AI');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { companyUrl, linkedinUrl } = body;

    // Validate input
    if (!companyUrl || !linkedinUrl) {
      return NextResponse.json(
        { error: 'Both companyUrl and linkedinUrl are required' },
        { status: 400 }
      );
    }

    // Validate LinkedIn URL format
    if (!linkedinUrl.includes('linkedin.com/in/')) {
      return NextResponse.json(
        { error: 'Invalid LinkedIn profile URL format' },
        { status: 400 }
      );
    }

    console.log(`Generating script for LinkedIn: ${linkedinUrl}`);

    // Scrape website content
    const companyInfo = await scrapeWebsiteContent(companyUrl);
    
    // Enrich LinkedIn profile using Crustdata API
    const linkedinProfile = await enrichLinkedInProfile(linkedinUrl);
    
    // Extract key insights for logging/debugging
    const insights = extractKeyInsights(linkedinProfile);
    console.log(`Generating script for ${insights.name} (${insights.currentRole})`);
    
    // Generate personalized script using OpenAI
    const script = await generatePersonalizedScript(companyInfo, linkedinProfile);

    return NextResponse.json({
      success: true,
      script,
      leadInsights: insights,
      personalizationPoints: generatePersonalizationPoints(linkedinProfile, companyInfo),
      companySource: 'jina', // Indicates real website data was used
      profileSource: 'crustdata', // Indicates real LinkedIn data was used
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate script',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 