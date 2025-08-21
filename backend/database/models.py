from pymongo.collection import Collection

# models.py
class Resume:
    def __init__(self, CandidateID, name, profile_summary, skills, education, experience=None, projects=None, certificates=None):
        self.CandidateID = CandidateID
        self.name = name
        self.profile_summary = profile_summary
        self.skills = skills
        self.education = education
        self.experience = self._process_experience(experience or [])  # Ensure it's always a list
        self.projects = projects or []  # Default to empty list if None
        self.certificates = self._process_certificates(certificates or [])  

    def _process_experience(self, experience):
        processed_experience = []
        if isinstance(experience, list):  # Ensure it's a list
            for exp in experience:
                if isinstance(exp, dict):  
                    processed_exp = {
                        "Title": exp.get("title") or exp.get("Title"),  
                        "Company": exp.get("company") or exp.get("Company"),
                        "Location": exp.get("location") or exp.get("Location"),
                        "Dates": f"{exp.get('start_date', '')} - {exp.get('end_date', '')}" 
                                  if exp.get('start_date') or exp.get('end_date') 
                                  else exp.get("Dates", ""),  
                    }
                    processed_experience.append(processed_exp)
        return processed_experience

    def _process_certificates(self, certificates):
        processed_certificates = []
        if isinstance(certificates, list):  
            for cert in certificates:
                if isinstance(cert, dict):  
                    processed_certificates.append(cert.get("name", ""))
                elif isinstance(cert, str):  
                    processed_certificates.append(cert)
        return processed_certificates

    def to_dict(self):
        return {
            "CandidateID": self.CandidateID,
            "name": self.name,
            "profile_summary": self.profile_summary,
            "skills": self.skills,
            "education": self.education,
            "experience": self.experience,
            "projects": self.projects,
            "certificates": self.certificates
        }
    
"""class JobDescription:
    def __init__(self, job_title, skills_required, location, experience_required, job_description, no_of_candidates):
        self.job_title = job_title
        self.skills_required = skills_required
        self.location = location
        self.experience_required = experience_required
        self.job_description = job_description
        self.no_of_candidates=no_of_candidates

    def to_dict(self):
       
        return {
            "job_title": self.job_title,
            "skills_required": self.skills_required,
            "location": self.location,
            "experience_required": self.experience_required,
            "job_description": self.job_description,
            "no_of_candidates":self.no_of_candidates
        }"""