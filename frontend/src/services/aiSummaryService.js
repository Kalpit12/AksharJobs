// AI Summary Generation Service
// This service can be extended to integrate with real AI APIs like OpenAI, Google AI, etc.

export class AISummaryService {
  static async generateProfessionalSummary(profileData) {
    // In production, this would call an actual AI service
    // For now, we'll use intelligent template-based generation
    
    const { jobTitle, firstName, lastName, experience, education, technicalSkills, softSkills } = profileData;
    const fullName = `${firstName} ${lastName}`.trim();
    const title = jobTitle || 'Professional';
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const summaries = [];
    
    // Generate contextual summaries based on available data
    if (experience?.length > 0) {
      summaries.push(...this.generateExperienceBasedSummaries(profileData));
    }
    
    if (technicalSkills?.length > 0) {
      summaries.push(...this.generateSkillBasedSummaries(profileData));
    }
    
    if (education?.length > 0) {
      summaries.push(...this.generateEducationBasedSummaries(profileData));
    }
    
    // Always include generic professional summaries
    summaries.push(...this.generateGenericSummaries(profileData));
    
    // Remove duplicates and return top 4 summaries
    const uniqueSummaries = this.removeDuplicates(summaries);
    return uniqueSummaries.slice(0, 4);
  }
  
  static generateExperienceBasedSummaries(profileData) {
    const { jobTitle, experience, technicalSkills, softSkills } = profileData;
    const title = jobTitle || 'Professional';
    const summaries = [];
    
    const totalExperience = this.calculateExperienceYears(experience);
    const companies = experience.map(exp => exp.company).filter(Boolean);
    const roles = experience.map(exp => exp.title).filter(Boolean);
    
    summaries.push({
      id: `exp-${Date.now()}-1`,
      type: 'Experience-Focused',
      content: `Accomplished ${title} with ${totalExperience} years of progressive experience in ${this.getIndustryFromExperience(experience)}. Proven track record at ${companies.slice(0, 2).join(' and ')}, demonstrating expertise in ${technicalSkills.slice(0, 3).join(', ')}. Strong ${softSkills.slice(0, 2).join(' and ').toLowerCase()} skills with a history of delivering exceptional results and driving team success.`
    });
    
    if (roles.length > 1) {
      summaries.push({
        id: `exp-${Date.now()}-2`,
        type: 'Career-Progression',
        content: `Dynamic ${title} with a diverse background spanning ${roles.slice(0, 2).join(' and ')} roles. ${totalExperience} years of experience building innovative solutions using ${technicalSkills.slice(0, 4).join(', ')}. Known for ${softSkills[0]?.toLowerCase() || 'strong leadership'} and ability to adapt to evolving business needs while maintaining high performance standards.`
      });
    }
    
    return summaries;
  }
  
  static generateSkillBasedSummaries(profileData) {
    const { jobTitle, technicalSkills, softSkills, experience } = profileData;
    const title = jobTitle || 'Professional';
    const summaries = [];
    
    // Group skills by category
    const frontendSkills = technicalSkills.filter(skill => 
      ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css'].some(tech => 
        skill.toLowerCase().includes(tech)
      )
    );
    
    const backendSkills = technicalSkills.filter(skill => 
      ['node', 'python', 'java', 'php', 'ruby', 'go', 'rust', 'c#'].some(tech => 
        skill.toLowerCase().includes(tech)
      )
    );
    
    summaries.push({
      id: `skill-${Date.now()}-1`,
      type: 'Technical-Expert',
      content: `Highly skilled ${title} specializing in ${technicalSkills.slice(0, 5).join(', ')}. Passionate about leveraging cutting-edge technologies to create scalable solutions and drive innovation. Combines technical excellence with ${softSkills.slice(0, 2).join(' and ').toLowerCase()}, making complex projects successful through collaborative approach and attention to detail.`
    });
    
    if (frontendSkills.length > 0 || backendSkills.length > 0) {
      const stackType = frontendSkills.length > backendSkills.length ? 'Frontend' : 
                       backendSkills.length > frontendSkills.length ? 'Backend' : 'Full-Stack';
      
      summaries.push({
        id: `skill-${Date.now()}-2`,
        type: `${stackType}-Specialist`,
        content: `${stackType} ${title} with deep expertise in modern web technologies. Proficient in ${technicalSkills.slice(0, 4).join(', ')}, with a focus on creating user-centric applications and robust systems. Strong advocate for best practices, code quality, and ${softSkills[0]?.toLowerCase() || 'continuous learning'}.`
      });
    }
    
    return summaries;
  }
  
  static generateEducationBasedSummaries(profileData) {
    const { jobTitle, education, technicalSkills, softSkills } = profileData;
    const title = jobTitle || 'Professional';
    const summaries = [];
    
    const latestEducation = education[0];
    if (latestEducation?.degree && latestEducation?.institution) {
      summaries.push({
        id: `edu-${Date.now()}-1`,
        type: 'Education-Focused',
        content: `${latestEducation.degree} graduate from ${latestEducation.institution} with expertise in ${technicalSkills.slice(0, 3).join(', ')}. Combines strong academic foundation with practical skills in ${softSkills.slice(0, 2).join(' and ').toLowerCase()}. Committed to applying theoretical knowledge to real-world challenges and driving innovation in the ${this.getFieldFromEducation(latestEducation.degree)} sector.`
      });
    }
    
    return summaries;
  }
  
  static generateGenericSummaries(profileData) {
    const { jobTitle, technicalSkills, softSkills } = profileData;
    const title = jobTitle || 'Professional';
    
    return [
      {
        id: `generic-${Date.now()}-1`,
        type: 'Professional',
        content: `Motivated ${title} with a passion for excellence and innovation. Skilled in ${technicalSkills.slice(0, 3).join(', ') || 'modern technologies'} with strong ${softSkills.slice(0, 2).join(' and ').toLowerCase() || 'communication and problem-solving'} abilities. Dedicated to continuous learning and delivering high-quality results that exceed expectations.`
      },
      {
        id: `generic-${Date.now()}-2`,
        type: 'Goal-Oriented',
        content: `Results-driven ${title} committed to leveraging technology for business success. Experience with ${technicalSkills.slice(0, 3).join(', ') || 'various technical tools'} and strong ${softSkills[0]?.toLowerCase() || 'leadership'} skills. Seeking opportunities to contribute to innovative projects while growing professionally in a collaborative environment.`
      }
    ];
  }
  
  static calculateExperienceYears(experience) {
    if (!experience || experience.length === 0) return '1-2';
    
    // Simple heuristic based on number of roles
    switch (experience.length) {
      case 1: return '2-3';
      case 2: return '3-5';
      case 3: return '5-7';
      default: return '7+';
    }
  }
  
  static getIndustryFromExperience(experience) {
    // Extract industry context from company names and roles
    const companies = experience.map(exp => exp.company?.toLowerCase() || '').join(' ');
    const roles = experience.map(exp => exp.title?.toLowerCase() || '').join(' ');
    
    if (companies.includes('tech') || roles.includes('software') || roles.includes('developer')) {
      return 'technology and software development';
    }
    if (roles.includes('marketing') || roles.includes('sales')) {
      return 'marketing and business development';
    }
    if (roles.includes('design') || roles.includes('ui') || roles.includes('ux')) {
      return 'design and user experience';
    }
    if (roles.includes('data') || roles.includes('analyst')) {
      return 'data analysis and insights';
    }
    
    return 'professional services';
  }
  
  static getFieldFromEducation(degree) {
    if (!degree) return 'technology';
    
    const degreeText = degree.toLowerCase();
    if (degreeText.includes('computer') || degreeText.includes('software')) return 'technology';
    if (degreeText.includes('business') || degreeText.includes('management')) return 'business';
    if (degreeText.includes('engineering')) return 'engineering';
    if (degreeText.includes('design')) return 'design';
    if (degreeText.includes('marketing')) return 'marketing';
    
    return 'professional';
  }
  
  static removeDuplicates(summaries) {
    const seen = new Set();
    return summaries.filter(summary => {
      const key = summary.content.substring(0, 50);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  
  // Future integration point for real AI APIs
  static async callRealAIService(profileData) {
    // This method can be implemented to call actual AI services
    // Example implementations:
    
    // OpenAI Integration:
    // const response = await fetch('/api/ai/generate-summary', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ profileData })
    // });
    
    // Google AI Integration:
    // const response = await fetch('/api/google-ai/generate-summary', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ profileData })
    // });
    
    throw new Error('Real AI service not implemented yet');
  }
}
