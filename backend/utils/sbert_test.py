from sentence_transformers import SentenceTransformer
import numpy as np
import time

# Load the fine-tuned SBERT model
MODEL_PATH = "C:/Users/vidhi/OneDrive/Desktop/Projects/Resume_to_Job_description_Matcher/fine_tuned_sbert"  # Change this to your actual path
sbert_model = SentenceTransformer(MODEL_PATH)

def get_embedding(text):
    """Generate a 384-dimensional sentence embedding using the fine-tuned SBERT model."""
    return sbert_model.encode(text, convert_to_numpy=True)

def compute_similarity(text1, text2):
    """Compute cosine similarity between two text embeddings and track execution time."""
    start_time = time.time()  # Start timing

    emb1 = get_embedding(text1)
    emb2 = get_embedding(text2)
    similarity = np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2))

    end_time = time.time()  # End timing
    execution_time = end_time - start_time

    return similarity, execution_time

# Resume-Job Description Pairs for Analysis
pairs = [
    {
        "resume": """
            Profile Summary: Experienced Data Analyst with a strong background in Python and Machine Learning.
            Skills: Python, Machine Learning, Data Analysis, SQL, TensorFlow.
            Education: Bachelor's in Computer Science.
            Experience: 2 years as a Data Analyst.
            Projects: Predictive Analytics: Built a model for sales forecasting.
            Certifications: Google Data Analytics Certificate.
        """,
        "job": """
            Job Title: Data Scientist.
            Experience Required: 2+ years in Data Science.
            Education Required: Bachelor's in Computer Science or related field.
            Skills Required: Python, Data Analysis, SQL.
            Job Description: Responsible for analyzing complex datasets and developing predictive models.
            Responsibilities: Develop ML models, perform data analysis, and present insights.
        """
    },
    {
        "resume": """
            Profile Summary: Backend Developer with expertise in Java and Spring Boot.
            Skills: Java, Spring Boot, Microservices, SQL, AWS.
            Education: Bachelor's in Information Technology.
            Experience: 3 years as a Backend Developer.
            Projects: E-commerce Platform: Developed scalable backend for an online store.
            Certifications: AWS Certified Developer.
        """,
        "job": """
            Job Title: Backend Developer.
            Experience Required: 2+ years in Software Development.
            Education Required: Bachelor's in Computer Science or equivalent.
            Skills Required: Java, Spring Boot, SQL, Microservices.
            Job Description: Responsible for building and maintaining backend systems.
            Responsibilities: Develop APIs, integrate databases, and ensure system performance.
        """
    },
    {
        "resume": """
            Profile Summary: Civil Engineer with expertise in structural design.
            Skills: AutoCAD, Structural Analysis, Project Management.
            Education: Bachelor's in Civil Engineering.
            Experience: 6 years as a Civil Engineer.
            Projects: Bridge Design: Led the design of a major bridge project.
            Certifications: Professional Engineer (PE) License.
        """,
        "job": """
            Job Title: Software Engineer.
            Experience Required: 3+ years in Software Development.
            Education Required: Bachelor's in Computer Science.
            Skills Required: Java, Python, SQL.
            Job Description: Develop and maintain software applications.
        """
    },
    {
        "resume": """
            Profile Summary: Sales Manager with a track record of exceeding targets.
            Skills: Sales, CRM, Negotiation, Team Leadership.
            Education: Bachelor's in Business Administration.
            Experience: 7 years as a Sales Manager.
            Projects: Sales Growth: Increased sales by 30% in a year.
            Certifications: None.
        """,
        "job": """
            Job Title: Project Manager.
            Experience Required: 5+ years in Project Management.
            Education Required: Bachelor’s Degree.
            Skills Required: Project Planning, Budgeting, Risk Management.
            Job Description: Lead and manage project teams to deliver projects on time and within budget.
        """
    },
    {
        "resume": """
            Profile Summary: A person who worked in a retail store for 2 years.
            Skills: Customer Service, Cash Handling, Inventory Management.
            Education: High School Diploma.
            Experience: 2 years as a Retail Assistant.
            Projects: None.
            Certifications: None.
        """,
        "job": """
            Job Title: AI Research Scientist.
            Experience Required: 5+ years in AI Research.
            Education Required: PhD in AI or related field.
            Skills Required: Deep Learning, NLP, Python, Research.
            Job Description: Conduct cutting-edge AI research.
        """
    },
    {
        "resume": """
            Profile Summary: A person who has experience in translation.
            Skills: Translation, Language interpretation, Editing.
            Education: Master’s degree in linguistics.
            Experience: 3 years as a translator.
            Projects: Translation of technical document.
            Certifications: None.
        """,
        "job": """
            Job Title: Software Tester.
            Experience Required: 2+ years in Software Testing.
            Education Required: Bachelor’s degree.
            Skills Required: Test Cases, Bug Reporting, Automation.
            Job Description: Test software applications for bugs and issues.
        """
    },
    {
        "resume": """
            Profile Summary: A person who has only completed online courses.
            Skills: Python, Data Analysis, SQL.
            Education: Self-taught, online courses.
            Experience: None.
            Projects: Personal data analysis projects.
            Certifications: Coursera Data Science Certificate.
        """,
        "job": """
            Job Title: Data Analyst.
            Experience Required: 1+ years in Data Analysis.
            Education Required: Bachelor’s Degree.
            Skills Required: Python, SQL, Data Visualization.
            Job Description: Analyze and interpret data to provide insights.
        """
    },
    {
        "resume": """
            Profile Summary: A person who has been a stay at home parent for 10 years.
            Skills: Organization, Time Management, Budgeting.
            Education: Bachelor’s degree in history.
            Experience: None.
            Projects: Managing family budgets.
            Certifications: None.
        """,
        "job": """
            Job Title: Office Manager.
            Experience Required: 3+ years in Office Management.
            Education Required: Bachelor’s Degree.
            Skills Required: Office Administration, Scheduling, Communication.
            Job Description: Manage office operations and ensure efficiency.
        """
    },
    {
        "resume": """Profile Summary: Experienced Project Coordinator with strong organizational skills. Skills: Project Planning, Budgeting, Scheduling, Communication. Education: Bachelor's in Business Administration. Experience: 4 years as Project Coordinator. Projects: Successfully managed several cross-functional projects. Certifications: PMP Certification in progress.""",
        "job": """Job Title: Project Manager. Experience Required: 5+ years in Project Management. Education Required: Bachelor’s Degree. Skills Required: Project Planning, Budgeting, Risk Management, Team Leadership. Job Description: Lead and manage project teams to deliver projects on time and within budget."""
    },
    {
        "resume": """Profile Summary: Recent graduate with a degree in Marketing. Skills: Social Media Marketing, Content Creation, Analytics. Education: Bachelor's in Marketing. Experience: Internship in social media marketing. Projects: Increased social media engagement for a local business. Certifications: Google Analytics Certification.""",
        "job": """Job Title: Digital Marketing Specialist. Experience Required: 1+ year in Digital Marketing. Education Required: Bachelor’s Degree. Skills Required: Social Media Marketing, SEO, Content Marketing. Job Description: Develop and execute digital marketing campaigns."""
    },
    {
        "resume": """Profile Summary: Experienced HR Generalist with expertise in recruitment and employee relations. Skills: Recruitment, Onboarding, Employee Relations, HR Policies. Education: Master’s in Human Resources. Experience: 6 years as HR Generalist. Projects: Implemented a new employee onboarding program. Certifications: SHRM-CP.""",
        "job": """Job Title: HR Manager. Experience Required: 5+ years in HR Management. Education Required: Master’s Degree. Skills Required: Recruitment, Employee Relations, Performance Management. Job Description: Manage all aspects of human resources operations."""
    },
    {
        "resume": """Profile Summary: Skilled in customer service and technical support. Skills: Customer Support, Troubleshooting, Communication. Education: Associate’s Degree. Experience: 3 years in technical support. Projects: Improved customer satisfaction ratings. Certifications: ITIL Foundation.""",
        "job": """Job Title: IT Help Desk Technician. Experience Required: 2+ years in IT Support. Education Required: Associate’s Degree. Skills Required: Troubleshooting, Customer Service, Network Support. Job Description: Provide technical support to end-users."""
    },
    {
        "resume": """Profile Summary: Experienced accountant with strong financial analysis skills. Skills: Financial Reporting, Budgeting, Auditing. Education: Bachelor’s in Accounting. Experience: 5 years as an Accountant. Projects: Managed financial audits for multiple clients. Certifications: CPA.""",
        "job": """Job Title: Financial Analyst. Experience Required: 3+ years in Financial Analysis. Education Required: Bachelor’s Degree. Skills Required: Financial Modeling, Forecasting, Reporting. Job Description: Analyze financial data and provide insights."""
    },
    {
        "resume": """Profile Summary: Skilled in graphic design and digital media. Skills: Adobe Creative Suite, UI/UX Design. Education: Bachelor’s in Graphic Design. Experience: 2 years as a Graphic Designer. Projects: Designed marketing materials for various clients. Certifications: None.""",
        "job": """Job Title: Web Designer. Experience Required: 2+ years in Web Design. Education Required: Bachelor’s Degree. Skills Required: HTML, CSS, JavaScript, UI/UX Design. Job Description: Design and develop websites."""
    },
    {
        "resume": """Profile Summary: Experienced in logistics and supply chain management. Skills: Inventory Management, Logistics, Supply Chain. Education: Master’s in Supply Chain Management. Experience: 4 years as a Logistics Coordinator. Projects: Optimized supply chain operations for a distribution company. Certifications: CSCP.""",
        "job": """Job Title: Supply Chain Manager. Experience Required: 5+ years in Supply Chain Management. Education Required: Master’s Degree. Skills Required: Logistics, Inventory Management, Procurement. Job Description: Manage end-to-end supply chain operations."""
    },
    {
        "resume": """Profile Summary: Experienced in teaching and curriculum development. Skills: Curriculum Development, Lesson Planning, Classroom Management. Education: Master’s in Education. Experience: 6 years as a Teacher. Projects: Developed and implemented new curriculum for a school district. Certifications: Teaching License.""",
        "job": """Job Title: Instructional Designer. Experience Required: 3+ years in Instructional Design. Education Required: Master’s Degree. Skills Required: Curriculum Development, E-learning, Training. Job Description: Design and develop training programs."""
    },
    {
        "resume": """Profile Summary: A person with experience in construction. Skills: Carpentry, Plumbing, Electrical. Education: High School Diploma. Experience: 5 years in construction. Projects: Built residential homes. Certifications: None.""",
        "job": """Job Title: Software Architect. Experience Required: 5+ years in Software Development. Education Required: Bachelor’s Degree. Skills Required: Java, Python, Cloud Computing. Job Description: Design and develop software systems."""
    },
    {
        "resume": """Profile Summary: A person with experience in sales and retail. Skills: Customer Service, Sales, Cash Handling. Education: High School Diploma. Experience: 3 years in retail sales. Projects: Increased sales in a retail store. Certifications: None.""",
        "job": """Job Title: Machine Learning Engineer. Experience Required: 3+ years in Machine Learning. Education Required: Master’s Degree. Skills Required: Python, TensorFlow, NLP. Job Description: Develop and deploy machine learning models."""
    },
    {
        "resume": """Profile Summary: Highly creative and innovative writer. Skills: Writing, Editing, Proofreading. Education: Bachelor's in English Literature. Experience: Freelance writer for 4 years. Projects: Wrote articles for various online publications. Certifications: None.""",
        "job": """Job Title: Technical Writer. Experience Required: 2+ years in Technical Writing. Education Required: Bachelor’s Degree. Skills Required: Technical Documentation, API Documentation, User Manuals. Job Description: Create technical documentation for software products."""
    },
    {
        "resume": """Profile Summary: Experienced in restaurant management. Skills: Menu Planning, Kitchen Management, Customer Service. Education: Culinary Arts Diploma. Experience: 7 years as a Restaurant Manager. Projects: Opened a new restaurant. Certifications: Food Safety Certification.""",
        "job": """Job Title: Data Scientist. Experience Required: 5+ years in Data Science. Education Required: PhD in Data Science. Skills Required: Python, Machine Learning, Statistical Analysis. Job Description: Develop and apply advanced data science techniques."""
    },
    {
        "resume": """Profile Summary: Skilled in legal research and writing. Skills: Legal Research, Legal Writing, Contract Review. Education: Juris Doctor (JD). Experience: 2 years as a Legal Assistant. Projects: Researched and drafted legal documents. Certifications: Bar Admission.""",
        "job": """Job Title: Software Developer. Experience Required: 3+ years in Software Development. Education Required: Bachelor’s Degree. Skills Required: Java, C++, JavaScript. Job Description: Develop and maintain software applications."""
    },
    {
        "resume": """Profile Summary: A person that worked as a librarian. Skills: Cataloging, Research, Customer Service. Education: Master's in Library Science. Experience: 4 years as a librarian. Projects: Digitized library collections. Certifications: None.""",
        "job": """Job Title: Network Engineer. Experience Required: 3+ years in Network Administration. Education Required: Bachelor's Degree. Skills Required: Cisco Routers, Network Security, Linux. Job Description: Design and maintain network infrastructure."""
    },
    {
        "resume": """Profile Summary: Experienced in physical therapy. Skills: Rehabilitation, Patient Care, Exercise Planning. Education: Doctorate in Physical Therapy. Experience: 5 years as a Physical Therapist. Projects: Developed rehabilitation programs for athletes. Certifications: Board Certified in Sports Physical Therapy.""",
        "job": """Job Title: AI Research Scientist. Experience Required: 5+ years in AI Research. Education Required: PhD in AI or related field. Skills Required: Deep Learning, NLP, Python, Research. Job Description: Conduct cutting-edge AI research."""
    },
    {
        "resume": """Profile Summary: A person that has experience in video editing and production. Skills: Adobe Premiere Pro, After Effects, Video Editing. Education: Bachelor's in Film and Media. Experience: 3 years as a Video Editor. Projects: Edited short films and documentaries. Certifications: None.""",
        "job": """Job Title: Cloud Architect. Experience Required: 5+ years in Cloud Computing. Education Required: Bachelor’s Degree. Skills Required: AWS, Azure, Cloud Security, System Design. Job Description: Design and implement cloud infrastructure."""
    },
    {
        "resume": """Profile Summary: Experienced in sales and business development. Skills: Sales, Negotiation, Business Development. Education: MBA in Sales and Marketing. Experience: 6 years as a Sales Manager. Projects: Increased sales in new market segments. Certifications: None.""",
        "job": """Job Title: Data Entry Clerk. Experience Required: 1+ year in Data Entry. Education Required: High School Diploma. Skills Required: Typing, Data Entry, Microsoft Office. Job Description: Input and manage data accurately."""
    },
    {
        "resume": """Profile Summary: A person with experience in security and surveillance. Skills: Security Systems, Surveillance, Risk Assessment. Education: Associate's Degree in Criminal Justice. Experience: 4 years as a Security Guard. Projects: Implemented security protocols for a large event. Certifications: Security Guard License.""",
        "job": """Job Title: Software Tester. Experience Required: 2+ years in Software Testing. Education Required: Bachelor’s Degree. Skills Required: Test Cases, Bug Reporting, Automation. Job Description: Test software applications for bugs and issues."""
    },
    {
        "resume": """Profile Summary: Skilled in event planning and coordination. Skills: Event Planning, Budget Management, Vendor Coordination. Education: Bachelor's in Event Management. Experience: 3 years as an Event Coordinator. Projects: Organized corporate events and conferences. Certifications: Certified Meeting Professional (CMP).""",
        "job": """Job Title: Data Analyst. Experience Required: 1+ years in Data Analysis. Education Required: Bachelor’s Degree. Skills Required: Python, SQL, Data Visualization. Job Description: Analyze and interpret data to provide insights."""
    },
    {
        "resume": """Profile Summary: A person who has worked as a truck driver. Skills: Driving, Logistics, Delivery. Education: High School Diploma. Experience: 6 years as a Truck Driver. Projects: Delivered goods across state lines. Certifications: Commercial Driver's License (CDL).""",
        "job": """Job Title: Frontend Developer. Experience Required: 2+ years in Frontend Development. Education Required: Bachelor's in Computer Science or related field. Skills Required: React, JavaScript, HTML, CSS. Job Description: Build dynamic and responsive web applications."""
    }
]

# Analysis Loop
for i, pair in enumerate(pairs):
    similarity_score, time_taken = compute_similarity(pair["resume"], pair["job"])
    print(f"\n--- Pair {i + 1} ---")
    print(f"Similarity Score: {similarity_score:.4f}")
    print(f"Time Taken: {time_taken:.6f} seconds")