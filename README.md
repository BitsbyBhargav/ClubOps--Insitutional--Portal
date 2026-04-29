ClubOps: Centralized Governance & Operations System

ClubOps is a professional, cloud-native management portal designed to digitize the administrative and operational workflows of student clubs at MIT ADT University. Born out of a need to eliminate the "communication black hole" inherent in manual, email-based approval processes, this system provides a transparent, real-time bridge between student leaders and university administration.

📖 The Origin Story
As the General Secretary of the Google Gemini Student Club, I witnessed the failure of manual governance firsthand. A critical technical event was forced into cancellation—leading to the loss of high-value sponsors—simply because a proposal was lost in a chain of informal messages and unmonitored emails. ClubOps was engineered to ensure that no student innovation is ever again halted by administrative silence.

🚀 Technical Evolution (The Pivot):

Initially conceptualized as a localized Java/Spring Boot desktop application, the project underwent a strategic architectural pivot following Technical Review 2. To ensure zero-install accessibility and seamless institutional scalability, the system was migrated to a modern Cloud-Native Web Stack. 
The StackFrontend: HTML5, CSS3, and Tailwind CSS utilizing the Google Stitch design system for an authoritative institutional aesthetic. 
Logic Layer: JavaScript (ES6+) integrated with the Supabase Client SDK for real-time operations. 
Database: Supabase Cloud (PostgreSQL) featuring Row Level Security (RLS) to govern data isolation and multi-tenant privacy. 
Deployment: Version-controlled via Git and hosted on GitHub Pages for live accessibility.

✨ Core FeaturesRole-Based Access Control (RBAC):
Secure authentication that automatically routes users to dedicated dashboards based on their institutional role (Admin vs. Club Head).  
Real-Time Status Synchronization: Club Coordinators can track event proposals through live status updates (Pending/Approved/Rejected), eliminating the need for follow-up emails.  
Administrative Registry: A centralized command center for Faculty Advisors to review, approve, or reject club activities with a single click.  
Audit-Ready Documentation: Automated record-keeping and report generation for university-level performance monitoring and audits

🏗️ System Architecture
The platform follows a Serverless-lite 3-tier architecture, prioritizing client-side efficiency and secure cloud data management.  


Presentation Layer: Responsive web interface built for cross-device accessibility.  


Application Layer: JavaScript logic handling business rules, role-routing, and API interactions.  


Data Layer: Managed PostgreSQL instance on Supabase Cloud ensuring high availability and data integrity.
