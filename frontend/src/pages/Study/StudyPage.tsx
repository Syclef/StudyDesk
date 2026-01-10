import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/study-plan.css";

const DOMAINS = [
  {
    name: "Information System Auditing Process",
    tasks: [
      "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
      "Types of Audits, Assessments, and Reviews",
      "Risk-Based Audit Planning",
      "Types of Controls and Considerations",
      "Audit Project Management",
      "Audit Testing and Sampling Methodology",
      "Audit Evidence Collection Techniques",
      "Audit Data Analytics",
      "Reporting and Communication Techniques",
      "Quality Assurance and Improvement of Audit Process",
    ],
  },
  {
    name: "Governance and Management of IT",
    tasks: [
      "Laws, Regulations, and Industry Standards",
      "Organizational Structures and Governance Frameworks",
      "IT Policies, Standards, Procedures, and Guidelines",
      "Enterprise Architecture and Considerations",
      "Enterprise Risk Management",
      "Privacy Program and Principles",
      "Data Governance and Classification",
      "IT Resource Management",
      "IT Vendor Management",
      "IT Performance Monitoring and Reporting",
      "Quality Assurance and Quality Management of IT",
    ],
  },
  {
    name: "Information Systems Operations and Business Resilience",
    children: [
      "IT Service Level Management",
      "IT Asset Management",
      "System and Operational Resilience",
      "Database Management",
      "Disaster Recovery Plans",
      "Systems Availability and Capacity Management",
      "Business Impact Analysis",
      "Operational Log Management",
      "Job Scheduling and Production Process Automation",
      "Business Continuity Plan",
      "IT Components",
      "Problem and Incident Management",
      "Shadow IT and End-User Computing",
      "Study Interfaces",
      "IT Change, Configuration, and Patch Management",
      "Data Backup, Storage, and Restoration",
    ],
  },
  {
    name: "Protection of Information Assets",
    children: [
      "Information System Attack Methods and Techniques",
      "Data Loss Prevention",
      "Cloud and Virtualized Environments",
      "Network and End-Point Security",
      "Identity and Access Management",
      "Evidence Collection and Forensics",
      "Data Encryption",
      "Physical and Environmental Controls",
      "Security Awareness Training and Programs",
      "Public Key Infrastructure",
      "Security Testing Tools and Techniques",
      "Security Incident Response Management",
      "Security Monitoring Logs, Tools, and Techniques",
      "Mobile, Wireless, and Internet-of-Things Devices",
      "Information Asset Security Policies, Frameworks, Standards, and Guidelines",
    ],
  },
  {
    name: "Information Systems Acquisition, Development, and Implementation",
    children: [
      "System Readiness and Implementation Testing",
      "Project Governance and Management",
      "System Development Methodologies",
      "Implementation Configuration and Release Management",
      "System Migration, Infrastructure Deployment, and Data Conversion",
      "Post-Implementation Review",
      "Business Case and Feasibility Analysis",
      "Control Identification and Design",
    ],
  },
];

export default function StudyPlanPage() {
  const navigate = useNavigate();
  const [openDomain, setOpenDomain] = useState<string | null>(
    DOMAINS[0].name
  );

  return (
    <div className="study-plan">
      {/* HEADER */}
      <div className="sp-header">
        <div className="sp-goal">
          <div className="sp-days">11</div>
          <div className="sp-sub">Days Until Exam</div>
        </div>

        <div className="sp-progress">
          <div className="sp-progress-header">
            <span>Study Plan Progress</span>
            <strong>90%</strong>
          </div>
          <div className="sp-progress-bar">
            <div className="sp-progress-fill" />
          </div>
        </div>
      </div>

      {/* PRACTICE CTA */}
      <div className="sp-current-task">
        <div>
          <strong>Practice Exam 3</strong>
          <span>300 Knowledge Points · 60+ Minutes</span>
        </div>
        <button>Study Task</button>
      </div>

      {/* DOMAIN GROUPS */}
      <div className="sp-domains">
        {DOMAINS.map((domain) => {
          const isOpen = openDomain === domain.name;

          return (
            <div key={domain.name} className="sp-domain">
              <div
                className="sp-domain-header"
                onClick={() =>
                  setOpenDomain(isOpen ? null : domain.name)
                }
              >
                <span>{domain.name}</span>
                <span>{isOpen ? "▾" : "▸"}</span>
              </div>

              {isOpen && (
                <div className="sp-domain-tasks">
                  {domain.tasks.map((task) => (
                    <div key={task} className="sp-task">
                      <div>
                        <strong>{task}</strong>
                        <span>30–60 Minutes</span>
                      </div>
                      <button
                        onClick={() =>
                          navigate(
                            `/study/session/${encodeURIComponent(task)}`
                          )
                        }
                      >
                        Study
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
