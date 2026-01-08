import { PracticeQuestion } from "./types";

export const domain1Questions: PracticeQuestion[] = [
  {
    id: "D1-1",
    domain: "1 - Information System Auditing Process",
    category: "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
    question:
      "Which of the following situations can impair the independence of an information systems (IS) auditor?",
    choices: {
      A: "Implemented specific functionality during the development of an application.",
      B: "Designed an embedded audit module for auditing an application.",
      C: "Participated as a member of an application project team and did not have operational responsibilities.",
      D: "Provided consulting advice concerning application good practices."
    },
    correctAnswer: "A",
    justification: {
      A: "Independence may be impaired if an IS auditor was actively involved in the development, acquisition or implementation of an application.",
      B: "Designing an embedded audit module does not impair auditor independence.",
      C: "Participation without operational responsibility does not impair independence.",
      D: "Providing advice on good practices does not impair independence."
    },
    taskStatement:
      "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
    taskId: "T2"
  },
  {
    id: "D1-2",
    domain: "1 - Information System Auditing Process",
    category: "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
    question:
      "What is the PRIMARY reason for an information systems (IS) auditor to exercise due professional care?",
    choices: {
      A: "To get reasonable assurance that IS controls are well-designed and effective",
      B: "To eliminate inherent, control and detection risk associated with IS audit",
      C: "To detect errors, misstatements or fraudulent transactions in IS and report them",
      D: "To make sure that evidence collected during the IS audit is appropriate and sufficient"
    },
    correctAnswer: "A",
    justification: {
      A: "Due professional care helps obtain reasonable assurance regarding IS controls.",
      B: "Audit risk cannot be eliminated, only reduced.",
      C: "Detection of fraud is not the primary objective.",
      D: "This supports assurance but is not the primary reason."
    },
    taskStatement:
      "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
    taskId: "T2"
  },
  {
    id: "D1-3",
    domain: "1 - Information System Auditing Process",
    category: "Risk-Based Audit Planning",
    question:
      "Which of the following BEST ensures the efficacy of risk-based auditing?",
    choices: {
      A: "Risk analysis",
      B: "Risk mitigation",
      C: "Risk assessment",
      D: "Risk treatment"
    },
    correctAnswer: "C",
    justification: {
      A: "Risk analysis is a subset of risk assessment.",
      B: "Risk mitigation occurs after assessment.",
      C: "Risk-based auditing relies on effective risk assessment.",
      D: "Risk treatment follows risk assessment."
    },
    taskStatement:
      "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
    taskId: "T2"
  },
  {
    id: "D1-4",
    domain: "1 - Information System Auditing Process",
    category: "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
    question:
      "The internal information systems (IS) audit team is auditing controls over sales returns and is concerned about fraud. Which of the following sampling methods will BEST assist the IS auditors?",
    choices: {
      A: "Stop-or-go",
      B: "Classical variable",
      C: "Discovery",
      D: "Probability-proportional-to-size"
    },
    correctAnswer: "C",
    justification: {
      A: "Stop-or-go limits sample size but is not fraud-focused.",
      B: "Classical variable sampling focuses on monetary values.",
      C: "Discovery sampling is designed to detect occurrences such as fraud.",
      D: "PPS sampling is not focused on fraud detection."
    },
    taskStatement:
      "Plan an audit to determine whether information systems are protected, controlled, and provide value to the organization",
    taskId: "T1"
  },
  {
    id: "D1-5",
    domain: "1 - Information System Auditing Process",
    category: "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
    question:
      "Which of the following responsibilities is MOST likely to compromise the independence of an information systems (IS) auditor when reviewing the risk management process?",
    choices: {
      A: "Participating in the design of the risk management framework",
      B: "Advising on different implementation techniques",
      C: "Facilitating risk awareness training",
      D: "Performing a due diligence review of the risk management processes"
    },
    correctAnswer: "A",
    justification: {
      A: "Designing the risk management framework involves designing controls, which compromises independence.",
      B: "Advising does not involve decision-making.",
      C: "Training facilitation does not impair independence.",
      D: "Due diligence reviews do not impair independence."
    },
    taskStatement:
      "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
    taskId: "T2"
  },
  {
    id: "D1-6",
    domain: "1 - Information System Auditing Process",
    category: "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
    question:
      "The effect of which of the following should have priority when planning the scope and objectives of an information systems (IS) audit?",
    choices: {
      A: "Applicable statutory requirements",
      B: "Applicable corporate standards",
      C: "Applicable industry good practices",
      D: "Organizational policies and procedures"
    },
    correctAnswer: "A",
    justification: {
      A: "Statutory requirements cannot be excluded from audit scope.",
      B: "Corporate standards do not override statutory requirements.",
      C: "Industry good practices are not mandatory.",
      D: "Organizational policies must align with laws."
    },
    taskStatement:
      "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
    taskId: "T2"
  },
  {
    id: "D1-7",
    domain: "1 - Information System Auditing Process",
    category: "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
    question:
      "During an exit interview, when there is disagreement regarding the impact of a finding, an information systems (IS) auditor should:",
    choices: {
      A: "Ask the auditee to sign a release form",
      B: "Elaborate on the significance of the finding and associated risk",
      C: "Report the disagreement to the audit committee",
      D: "Accept the auditee’s position"
    },
    correctAnswer: "B",
    justification: {
      A: "This is inappropriate and adversarial.",
      B: "The auditor should clarify the risk and exposure.",
      C: "Escalation is not the first step.",
      D: "The auditor must remain independent."
    },
    taskStatement:
      "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
    taskId: "T2"
  },
  {
    id: "D1-8",
    domain: "1 - Information System Auditing Process",
    category: "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
    question:
      "Which audit technique provides the BEST evidence of separation of duties in an IT department?",
    choices: {
      A: "Discussion with management",
      B: "Review of the organization chart",
      C: "Observation and interviews",
      D: "Testing of user access rights"
    },
    correctAnswer: "C",
    justification: {
      A: "Management may not know detailed task execution.",
      B: "Organization charts do not show actual practices.",
      C: "Observation and interviews reveal actual duties performed.",
      D: "Access rights alone do not prove duties."
    },
    taskStatement:
      "Plan an audit to determine whether information systems are protected, controlled, and provide value to the organization",
    taskId: "T1"
  },
  {
    id: "D1-9",
    domain: "1 - Information System Auditing Process",
    category: "Risk-Based Audit Planning",
    question:
      "When developing a risk-based audit strategy, an information systems (IS) auditor should conduct a risk assessment to ensure that:",
    choices: {
      A: "Controls needed to mitigate risk are in place",
      B: "Vulnerabilities and threats are identified",
      C: "Audit risk is considered",
      D: "A gap analysis is appropriate"
    },
    correctAnswer: "B",
    justification: {
      A: "Control evaluation is an audit outcome.",
      B: "Threats and vulnerabilities drive audit focus.",
      C: "Audit risk relates to the audit process.",
      D: "Gap analysis is separate from risk assessment."
    },
    taskStatement:
      "Plan an audit to determine whether information systems are protected, controlled, and provide value to the organization",
    taskId: "T1"
  },
  {
    id: "D1-10",
    domain: "1 - Information System Auditing Process",
    category: "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
    question:
      "An information systems (IS) auditor is reviewing a software application that is built on the principles of service-oriented architecture. What is the INITIAL step?",
    choices: {
      A: "Understanding services and their allocation to business processes by reviewting the service repository documentation",
      B: "Sampling the use of service security standards such as represented by the Security Assertions Markup Language",
      C: "Reviewing the service level agreements established for all system providers",
      D: "Auditing the core service and its dependencies on other systems"
    },
    correctAnswer: "A",
    justification: {
      A: "A service-oriented architecture relies on the principles of a distributed environment in which services encapsulate business logic as a black box and might be deliberately combined to depict real-world business processes. Before reviewing services in detail, it is essential for the information systems (IS) auditor to comprehend the mapping of business processes to services.",
      B: "Sampling the use of service security standards as represented by Security Assertions Markup Language (SAML) is an essential follow-up step to understanding services and their allocation to business but is not the initial step.",
      C: "Reviewing the service level agreements is an essential follow-up step to understanding services and their allocation to business but is not the initial step.",
      D: "Auditing the core service and its dependencies with others is most likely a part of the audit, but the IS auditor must first gain an understanding of the business processes and how the systems support those processes."
    },
    taskStatement:
      "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
    taskId: "T2"
  },
  {
    id: "D1-11",
    domain: "1 - Information System Auditing Process",
    category: "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
    question:
      "A system developer transfers to the audit department to serve as an IT auditor. When production systems are to be reviewed by this employee, which is the MOST significant concern?",
    choices: {
      A: "The work may be construed as a self-audit",
      B: "Audit points may largely shift to technical aspects",
      C: "The employee may lack control assessment skills",
      D: "The employee's knowledge of business risk may be limited"
    },
    correctAnswer: "A",
    justification: {
      A: "Because the employee had been a developer, it is recommended that the audit coverage should exclude the systems developed by this employee to avoid any conflicts of interests.",
      B: "Because the employee has a technical background, it is possible that the audit findings tend to focus on technical matters. However, this is normally corrected in the review process before it is carried out in production.",
      C: "Because auditing is a new role for this employee, they may not have adequate control assessment skills. However, this can be addressed by on-the-job training and is not as big of a concern as a potential conflict of interest.",
      D: "Because this employee was previously employed in the organization’s IT department, it is possible to build upon the employee’s current understanding of the business to address any gaps in knowledge."
    },
    taskStatement:
      "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
    taskId: "T2"
  },
  {
  id: "D1-12",
  domain: "1 - Information System Auditing Process",
  category: "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
  question:
    "After reviewing the disaster recovery planning process of an organization, an information systems (IS) auditor requests a meeting with organization management to discuss the findings. Which of the following BEST describes the main goal of this meeting?",
  choices: {
    A: "Obtain management approval of the corrective action plan.",
    B: "Confirm factual accuracy of the findings.",
    C: "Assist management in the implementation of corrective actions.",
    D: "Prioritize the resolution of the items."
  },
  correctAnswer: "B",
  justification: {
    A: "Management approval of the corrective action plan is not required. Management can elect to implement another corrective action plan to address the risk.",
    B: "The goal of the meeting is to confirm the factual accuracy of the audit findings and present an opportunity for management to agree on or respond to recommendations for corrective action.",
    C: "Implementation of corrective actions should be done after the factual accuracy of findings is established, but the work of implementing corrective action is not typically assigned to the information systems (IS) auditor, because this impairs the auditor’s independence.",
    D: "Rating the audit findings provides guidance to management for allocating resources to the high-risk items first."
  },
  taskStatement:
    "Plan an audit to determine whether information systems are protected, controlled, and provide value to the organization",
  taskId: "T1"
},
  {
  id: "D1-13",
  domain: "1 - Information System Auditing Process",
  category: "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
  question:
    "Which of the following BEST describes the purpose of using information systems (IS) auditing and assurance standards?",
  choices: {
    A: "Providing instruction in applying information systems (IS) audit and assurance processes",
    B: "Identifying instances of processes IS auditors follow in an audit engagement",
    C: "Providing information on how to meet the requirements when completing IS auditing",
    D: "Defining mandatory requirements for IS audit and assurance and reporting"
  },
  correctAnswer: "D",
  justification: {
    A: "Guidelines are used to provide instruction or guidance in applying information systems (IS) audit and assurance processes.",
    B: "Tools and techniques are used to provide instances or examples of processes IS auditors follow in an audit engagement.",
    C: "Tools and techniques are used to provide information on how to meet the requirements when completing IS auditing.",
    D: "Standards are used mainly to define mandatory requirements for IS audit and assurance and reporting."
  },
  taskStatement:
    "Plan an audit to determine whether information systems are protected, controlled, and provide value to the organization",
  taskId: "T1"
},

{
  id: "D1-14",
  domain: "1 - Information System Auditing Process",
  category: "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
  question:
    "An information systems (IS) auditor is reviewing a project risk assessment and notices that the overall residual risk level is high due to confidentiality requirements. Which of the following types of risk is normally high due to the number of unauthorized users the project may affect?",
  choices: {
    A: "Control risk",
    B: "Compliance risk",
    C: "Inherent risk",
    D: "Residual risk"
  },
  correctAnswer: "C",
  justification: {
    A: "Control risk can be high, but it is not due to internal controls not being identified, evaluated or tested, and is not due to the number of users or business areas affected.",
    B: "Compliance risk is the penalty applied to current and future earnings for nonconformance to laws and regulations and may not be impacted by the number of users and business areas affected.",
    C: "Inherent risk is normally high due to the number of users and business areas that may be affected. Inherent risk is the risk level or exposure without considering the actions that management has taken or might take.",
    D: "Residual risk is the remaining risk after management has implemented a risk response and is not based on the number of users or business areas affected."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-15",
  domain: "1 - Information System Auditing Process",
  category: "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
  question:
    "An information systems (IS) auditor realizes that the skilled resources required to test the specific technical controls are only available for a limited period during an IS audit; therefore, comprehensive testing of all audit areas may not be possible. Which of the following is the BEST course of action for the auditor?",
  choices: {
    A: "Execute the audit focusing on critical areas where skilled resources are used to test controls.",
    B: "Have audit management request skilled resources for the entire audit period.",
    C: "Refuse to conduct the audit unless skilled resources are available for the entire audit period.",
    D: "Extend the timelines of the audit project for training to enhance the skills of the audit team."
  },
  correctAnswer: "A",
  justification: {
    A: "In a situation where limited resources are available; an auditor may use the services of skilled resources for high-risk audit areas to ensure that the maximum number of controls in high-risk areas are tested.",
    B: "Auditors may escalate the issue to audit management, but, in the case of unavailable resources, it is best to address high-risk areas first.",
    C: "Refusing to conduct an audit may not be a reasonable solution and will cause control failures or weaknesses in high-risk areas to remain undetected.",
    D: "It is useful to have the audit team increase their knowledge and skills; however, this option may not be reasonable to auditee management."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-16",
  domain: "1 - Information System Auditing Process",
  category: "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
  question:
    "Which of the following sampling methods is the MOST appropriate for testing automated invoice authorization controls to ensure that exceptions are not made for specific users?",
  choices: {
    A: "Variable sampling",
    B: "Judgmental sampling",
    C: "Stratified random sampling",
    D: "Systematic sampling"
  },
  correctAnswer: "C",
  justification: {
    A: "Variable sampling is used for substantive testing to determine the monetary or volumetric impact of characteristics of a population. This is not the most appropriate method in this case.",
    B: "In judgmental sampling, professionals place a bias on the sample (e.g., all sampling units over a certain value, all for a specific type of exception or all negatives). A judgmental sample is not statistically based, and results should not be extrapolated over the population because the sample is unlikely to be representative of the population.",
    C: "Stratification is the process of dividing a population into subpopulations with similar characteristics explicitly defined, so that each sampling unit can belong to only one stratum. This method of sampling ensures that all sampling units in each subgroup have a known, nonzero chance of selection. It is the most appropriate method in this case.",
    D: "Systematic sampling involves selecting sampling units using a fixed interval between selections with the first interval having a random start. This is not the most appropriate method in this case."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-17",
  domain: "1 - Information System Auditing Process",
  category: "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
  question:
    "Which of the following sampling methods is MOST useful when testing for compliance?",
  choices: {
    A: "Attribute sampling",
    B: "Variable sampling",
    C: "Stratified mean-per-unit sampling",
    D: "Difference estimation sampling"
  },
  correctAnswer: "A",
  justification: {
    A: "Attribute sampling is the primary sampling method used for compliance testing. Attribute sampling is a sampling model that is used to estimate the rate of occurrence of a specific quality (attribute) in a population and is used in compliance testing to confirm whether the quality exists. For example, an attribute sample may check all transactions over a certain predefined dollar amount for proper approvals.",
    B: "Variable sampling is based on the calculation of a mean from a sample extracted from the entire population and using that to estimate the characteristics of the entire population. This is not a good way to measure compliance with a process.",
    C: "Stratified mean-per-unit sampling attempts to ensure that the entire population is represented in the sample. This is not an effective way to measure compliance.",
    D: "Difference estimation sampling examines measure deviations and extraordinary items and is not a good way to measure compliance."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-18",
  domain: "1 - Information System Auditing Process",
  category: "Audit Project Management",
  question:
    "As part of standardizing the audit functions of different subsidiaries, the chief internal auditor has asked each audit team to use the already developed comprehensive audit manual. This manual was written with large, decentralized audit teams in mind. One of the subsidiaries has a small internal audit function consisting of a supervisor and two junior auditors. What is the BEST approach in providing administrative guidance for this small audit team?",
  choices: {
    A: "Use informal supervisory directions for audit engagement management issues.",
    B: "Select critical administrative processes from the audit manual and use verbal directions for other engagement management issues.",
    C: "Continue using the administrative procedures already being followed by the internal auditors of that subsidiary.",
    D: "Use processes from the already developed manual as written."
  },
  correctAnswer: "B",
  justification: {
    A: "It is inappropriate to leave the small audit team with only informal supervisory directions.",
    B: "The small audit team should adopt key procedures from the audit manual as it starts to absorb the detailed guidance. The form and content of procedures are dependent upon the size and structure of the internal audit activity and the complexity of its work. A small internal audit function may be managed informally, for example, through daily close supervision and discussions.",
    C: "Standardization efforts require that all the administrative activities of audit functions be consistent for each subsidiary.",
    D: "Being a small audit team, complete reliance on the existing manual would require more formal management and may be overkill in terms of efficiency of the audit work."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-19",
  domain: "1 - Information System Auditing Process",
  category: "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
  question:
    "Which of the following is MOST important to ensure before communicating the audit findings to top management during the closing meeting?",
  choices: {
    A: "Risk statement includes an explanation of a business impact",
    B: "Findings are clearly tracked back to evidence",
    C: "Recommendations address root causes of findings",
    D: "Remediation plans are provided by responsible parties"
  },
  correctAnswer: "B",
  justification: {
    A: "It is important to have a well-elaborated risk statement; however, it might not be relevant if the findings are not accurate.",
    B: "Without adequate evidence, the findings hold no ground; therefore, this must be verified before communicating the findings.",
    C: "It is important to address the root causes of the findings, and they may not be included in the report. However, they might not be relevant if the findings are not accurate.",
    D: "In some cases, top management might expect to see remediation plans during debriefing of the findings; however, the accuracy of findings should be proved first."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},
{
  id: "D1-20",
  domain: "1 - Information System Auditing Process",
  category: "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
  question:
    "An information systems (IS) auditor received an engagement to audit the enterprise resource planning (ERP) implementation from an audit committee. The auditor does not have competency in the specific ERP solution implemented by the auditee. Which of the following is the BEST course of action for the auditor?",
  choices: {
    A: "Attend a course to understand the specific enterprise resource planning (ERP) solution before conducting the audit.",
    B: "Hire an independent expert to support the audit with approval from the audit committee.",
    C: "Refuse to conduct the audit on the grounds of a lack of required competencies.",
    D: "Conduct a black-box audit around the ERP without going into specific controls."
  },
  correctAnswer: "B",
  justification: {
    A: "Attending a course might be time-consuming, expensive and still may not provide the required competency.",
    B: "information systems (IS) audit standards permit the use of other experts to fill a competency gap.",
    C: "Refusing to conduct the audit is not the best course of action as standards permit the auditor to use other experts to fill the competency gap.",
    D: "Conducting a black box audit may not meet the audit objectives."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},
  {
  id: "D1-21",
  domain: "1 - Information System Auditing Process",
  category: "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
  question:
    "Which of the following is the GREATEST concern if audit objectives are not established during the initial phase of an audit program?",
  choices: {
    A: "Key stakeholders are incorrectly identified.",
    B: "Control costs will exceed the planned budget.",
    C: "Important business risk may be overlooked.",
    D: "Previously audited areas may be inadvertently included."
  },
  correctAnswer: "C",
  justification: {
    A: "In certain cases, it may be difficult to discuss findings when incorrect stakeholders are identified, thus delaying the communication of audit findings. However, this is not as concerning as important business risk not being included in audit scope.",
    B: "Many factors determine the cost of controls. Therefore, it is difficult to state that only audit objectives will determine the control cost. However, this is not as important if the key risk is not identified.",
    C: "Without an audit scope, the appropriate risk assessment has not been performed, and therefore, the auditor might not audit those areas of highest risk for the organization.",
    D: "Auditing previously audited areas is not an efficient use of resources; however, this is not as big of a concern as key risk not being identified."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-22",
  domain: "1 - Information System Auditing Process",
  category: "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
  question:
    "An information systems (IS) auditor of an enterprise is also the auditor for a cloud services provider (CSP). Enterprise management requested a copy of the CSP’s audit report from the auditor because they are also a client of the CSP. Which of the following is the BEST course of action for the IS auditor?",
  choices: {
    A: "Share the report because the enterprise will receive it anyway per their contract with the cloud services provider (CSP).",
    B: "Request the management get a copy of the report directly from the CSP.",
    C: "Refuse to share the report because the auditor has signed a nondisclosure agreement with the CSP.",
    D: "Discuss general findings informally to provide assurance on compliance by the CSP."
  },
  correctAnswer: "B",
  justification: {
    A: "Sharing the report directly is a violation of professional ethics.",
    B: "The auditor cannot share any information received from one client with another because this is against professional ethics. Therefore, the best course of action is for the enterprise to request the report directly from the cloud services provider (CSP).",
    C: "The auditor may politely refuse to share the report, but direct refusal may not be the best approach.",
    D: "Professional ethics require that the auditor should not share anything from one client with another, even informally."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-23",
  domain: "1 - Information System Auditing Process",
  category: "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
  question:
    "Due to unexpected resource constraints of the information systems (IS) audit team, the audit plan, as originally approved, cannot be completed. Assuming that the situation is communicated in the audit report, which course of action is MOST acceptable?",
  choices: {
    A: "Test the adequacy of the control design.",
    B: "Test the operational effectiveness of controls.",
    C: "Focus on auditing high-risk areas.",
    D: "Rely on management testing of controls."
  },
  correctAnswer: "C",
  justification: {
    A: "Testing the adequacy of control design is not the best course of action because this does not ensure that controls operate effectively as designed.",
    B: "Testing control operating effectiveness does not ensure that the audit plan is focused on areas of greatest risk.",
    C: "Reducing the scope and focusing on auditing high-risk areas is the best course of action.",
    D: "The reliance on management testing of controls does not provide an objective verification of the control environment."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-24",
  domain: "1 - Information System Auditing Process",
  category: "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
  question:
    "A long-term IT employee with a strong technical background and broad managerial experience has applied for a vacant position in the information systems (IS) audit department. Determining whether to hire this individual for this position should be PRIMARILY based on the individual’s experience and:",
  choices: {
    A: "Length of service because this will help ensure technical competence.",
    B: "Age because training in audit techniques may be impractical.",
    C: "IT knowledge because this will bring enhanced credibility to the audit function.",
    D: "Ability, as an IS auditor, to be independent of existing IT relationships."
  },
  correctAnswer: "D",
  justification: {
    A: "Length of service does not ensure technical competency.",
    B: "Evaluating an individual’s qualifications based on the age of the individual is not a good criterion and is illegal in many parts of the world.",
    C: "The fact that the employee has worked in IT for many years may not ensure credibility. The information systems (IS) audit department’s needs should be defined, and any candidate should be evaluated against those requirements.",
    D: "Independence should be continually assessed by the auditor and management. This assessment should consider such factors as changes in personal relationships, financial interests, and prior job assignments and responsibilities."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-25",
  domain: "1 - Information System Auditing Process",
  category: "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
  question:
    "While conducting an information systems (IS) audit, the auditor observed fraudulent activity in an area that was outside the scope of the audit. Which of the following is the BEST course of action for the auditor?",
  choices: {
    A: "Conduct an audit of the suspected area and include it in the report.",
    B: "Communicate the observations to senior management.",
    C: "Ignore the activity and do nothing, since it is not within the scope of the audit.",
    D: "Report the fraudulent activity to a law enforcement agency."
  },
  correctAnswer: "B",
  justification: {
    A: "Since the fraudulent activity is not in the scope of the audit, the auditor may not have authority to conduct an audit in the suspected area.",
    B: "Although the fraudulent activity is not in the scope of the audit, it is prudent for the auditor to communicate to senior management or the audit committee to enable them to take necessary steps.",
    C: "Ignoring possible fraud is not ethical.",
    D: "Reporting to an external law enforcement agency is against professional ethics and out of scope of audit performance."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},
{
  id: "D1-33",
  domain: "1 - Information System Auditing Process",
  category: "Audit Data Analytics",
  question:
    "For a retail business with a large volume of transactions, which of the following audit techniques is the MOST appropriate for addressing emerging risk?",
  choices: {
    A: "Use of computer-assisted audit techniques (CAATs)",
    B: "Quarterly risk assessments",
    C: "Sampling of transaction logs",
    D: "Continuous auditing"
  },
  correctAnswer: "D",
  justification: {
    A: "Using software tools such as computer-assisted audit techniques (CAATs) to analyze transaction data can provide detailed analysis of trends and potential risk, but it is not as effective as continuous auditing, because a time differential may exist between executing the software and analyzing the results.",
    B: "Quarterly risk assessment may be a good technique but not as responsive as continuous auditing.",
    C: "The sampling of transaction logs is a valid audit technique; however, risk may exist that is not captured in the transaction log, and the analysis may have a potential time lag.",
    D: "The implementation of continuous auditing enables a real-time feed of information to management through automated reporting processes so that management may implement corrective actions more quickly."
  },
  taskStatement:
    "Utilize data analytics tools to enhance audit processes",
  taskId: "T6"
},

{
  id: "D1-34",
  domain: "1 - Information System Auditing Process",
  category: "Audit Data Analytics",
  question:
    "Which of the following represents an example of a preventive control with respect to IT personnel?",
  choices: {
    A: "A security guard stationed at the server room door",
    B: "An intrusion detection system (IDS)",
    C: "A badge entry system for the IT facility",
    D: "A fire-suppression system in the server room"
  },
  correctAnswer: "C",
  justification: {
    A: "A security guard is a deterrent control.",
    B: "An intrusion detection system (IDS) is a detective control.",
    C: "Preventive controls are used to reduce the probability of an adverse event. A badge entry system prevents unauthorized entry to the facility.",
    D: "A fire-suppression system is a corrective control."
  },
  taskStatement:
    "Utilize data analytics tools to enhance audit processes",
  taskId: "T6"
},

{
  id: "D1-35",
  domain: "1 - Information System Auditing Process",
  category: "Audit Data Analytics",
  question:
    "What is the PRIMARY requirement that a data mining and auditing software tool should meet? The software tool should:",
  choices: {
    A: "Interface with various types of enterprise resource planning software and databases.",
    B: "Accurately capture data from the enterprise systems without causing excessive performance problems.",
    C: "Introduce audit hooks into the financial systems of the enterprise to support continuous auditing.",
    D: "Be customizable and support inclusion of custom programming to aid in investigative analysis."
  },
  correctAnswer: "B",
  justification: {
    A: "The product must interface with the types of systems used by the enterprise and provide meaningful data for analysis.",
    B: "Although all the requirements that are listed as answer choices are desirable in a software tool evaluated for auditing and data mining purposes, the most critical requirement is that the tool works effectively on the systems of the enterprise being audited.",
    C: "The tool should probably work on more than just financial systems and does not necessarily require implementation of audit hooks.",
    D: "The tool should be flexible but not necessarily customizable. It should have built-in analysis software tools."
  },
  taskStatement:
    "Utilize data analytics tools to enhance audit processes",
  taskId: "T6"
},

{
  id: "D1-36",
  domain: "1 - Information System Auditing Process",
  category: "Audit Data Analytics",
  question:
    "The MAIN purpose of a transaction audit trail is to:",
  choices: {
    A: "Reduce the use of storage media.",
    B: "Determine accountability and responsibility for processed transactions.",
    C: "Help an information systems (IS) auditor trace transactions.",
    D: "Provide useful information for capacity planning."
  },
  correctAnswer: "B",
  justification: {
    A: "Enabling audit trails increases the use of disk space.",
    B: "Enabling audit trails aids in establishing the accountability and responsibility for processed transactions by tracing them through the information system.",
    C: "A transaction log file is used to trace transactions, but the primary purpose of an audit trail is to support accountability, not to support the work of the information systems (IS) auditor.",
    D: "The objective of capacity planning is the efficient and effective use of IT resources and requires information, such as central processing unit utilization, bandwidth and the number of users."
  },
  taskStatement:
    "Utilize data analytics tools to enhance audit processes",
  taskId: "T6"
},

{
  id: "D1-37",
  domain: "1 - Information System Auditing Process",
  category: "Audit Data Analytics",
  question:
    "How would data analytics BEST help in information systems (IS) auditing?",
  choices: {
    A: "Ensuring that the information systems (IS) auditing process is completed on time and accurate",
    B: "Automating auditing process and examining a large quantity of data",
    C: "Improving auditing quality and decreasing human intervention",
    D: "Detecting potential issues with the IS controls of an organization"
  },
  correctAnswer: "D",
  justification: {
    A: "Like any other project, information systems (IS) auditing should be completed as per the constraints of scope, time and cost, and should be accurate to be able to assess the objectives and effectiveness of IS controls.",
    B: "Automating the auditing process can give time for auditors to focus on critical aspects of their audit objectives, like reducing risk. Examining appropriate and sufficient evidence helps to evaluate the objectives and effectiveness of IS controls.",
    C: "Accuracy, collecting authentic information for evidence analysis and reducing human errors in auditing helps to judge whether IS controls are effective and function as expected.",
    D: "IS auditing, being a risk-based process, should be able to detect the potential issues within IS controls and conclude whether those controls are well-designed and effective."
  },
  taskStatement:
    "Utilize data analytics tools to enhance audit processes",
  taskId: "T6"
},

{
  id: "D1-38",
  domain: "1 - Information System Auditing Process",
  category: "Audit Data Analytics",
  question:
    "Which of the following audit techniques BEST helps an information systems (IS) auditor to determine whether unauthorized program changes have been made since the last authorized program update?",
  choices: {
    A: "Test data run",
    B: "Code review",
    C: "Automated code comparison",
    D: "Review of code migration procedures"
  },
  correctAnswer: "C",
  justification: {
    A: "Test data runs permit the auditor to verify the processing of preselected transactions but provide no evidence about unauthorized changes or unexercised portions of a program.",
    B: "Code review is the process of reading program source code listings to determine whether the code follows coding standards or contains potential errors or inefficient statements. A code review can be used as a means of code comparison, but it is inefficient and unlikely to detect any changes in the code, especially in a large program.",
    C: "An automated code comparison is the process of comparing two versions of the same program to determine whether the two correspond. It is an efficient technique because it is an automated procedure.",
    D: "The review of code migration procedures does not detect unauthorized program changes."
  },
  taskStatement:
    "Utilize data analytics tools to enhance audit processes",
  taskId: "T6"
},

{
  id: "D1-39",
  domain: "1 - Information System Auditing Process",
  category: "Audit Data Analytics",
  question:
    "What is a KEY benefit of incorporating data analytics into the audit process?",
  choices: {
    A: "Identification of patterns and trends in data for risk assessment",
    B: "Elimination of the need for audit testing and sampling",
    C: "Reduction of audit scope and reliance on internal controls",
    D: "Addition of work for auditors to learn data analysis tools"
  },
  correctAnswer: "A",
  justification: {
    A: "Incorporating data analytics into the audit process enables auditors to analyze large volumes of data efficiently and effectively. One of the key benefits of using data analytics is the ability to identify patterns and trends in data, which can provide valuable insights for risk assessment. By analyzing data, auditors can detect anomalies, assess the effectiveness of controls and identify potential areas of risk or noncompliance. Incorporating data analytics into the audit process brings several benefits, but a key benefit is enhanced decision-making.",
    B: "Although data analytics can enhance the audit process, it does not eliminate the need for audit testing and sampling.",
    C: "Data analytics does not directly reduce the audit scope but, instead, helps auditors focus their efforts on areas of higher risk and significance.",
    D: "Although data analytics can enhance the audit process, it does not replace auditors with the use of automated tools. Using a data analytics tool may require some learning by auditors; however, it may reduce the workload in the long term."
  },
  taskStatement:
    "Utilize data analytics tools to enhance audit processes",
  taskId: "T6"
},
{
  id: "D1-40",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "An information systems (IS) auditor is reviewing risk and controls of the wire transfer system of a bank. To ensure that the bank financial risk is properly addressed, the IS auditor most likely reviews which of the following?",
  choices: {
    A: "Privileged access to the wire transfer system",
    B: "Wire transfer procedures",
    C: "Fraud monitoring controls",
    D: "Employee background checks"
  },
  correctAnswer: "B",
  justification: {
    A: "Privileged access, such as administrator access, is necessary to manage user account privileges and should not be granted to end users. The wire transfer procedures are a better control to review to ensure that there is separation of duties of the end users to help prevent fraud.",
    B: "Wire transfer procedures include separation of duties controls. This helps prevent internal fraud by not allowing one person to initiate, approve and send a wire. Therefore, the information systems (IS) auditor should review the procedures as they relate to the wire system.",
    C: "Fraud monitoring is a detective control and does not prevent financial loss. Separation of duties is a preventive control which is part of the wire transfer procedures.",
    D: "Although controls related to background checks are important, the controls related to separation of duties as found in the wire transfer procedures are more critical."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-41",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "The data owners are responsible for:",
  choices: {
    A: "safeguarding the data by creating regular backups.",
    B: "security of data throughout their life cycle from origination to destruction.",
    C: "protecting the data by monitoring them in real time.",
    D: "performing risk assessment and implementing appropriate controls."
  },
  correctAnswer: "B",
  justification: {
    A: "The data owners generally do not create the backups but define the requirements for data backup.",
    B: "The data owners are primarily responsible for safeguarding the data they own.",
    C: "The data owners generally do not monitor the data communication but define the data monitoring requirements for the custodian or other responsible personnel.",
    D: "The data owners generally do not perform the risk assessment but define the risk management requirements."
  },
  taskStatement:
    "Plan an audit to determine whether information systems are protected, controlled, and provide value to the organization",
  taskId: "T1"
},

{
  id: "D1-42",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "An information systems (IS) auditor who has discovered unauthorized transactions during a review of electronic data interchange (EDI) transactions is likely to recommend improving the:",
  choices: {
    A: "EDI trading partner agreements.",
    B: "physical controls for terminals.",
    C: "authentication techniques for sending and receiving messages.",
    D: "program change control procedures."
  },
  correctAnswer: "C",
  justification: {
    A: "Electronic data interchange trading partner agreements minimize exposure to legal issues but do not resolve the problem of unauthorized transactions.",
    B: "Physical control is important and may provide protection from unauthorized people accessing the system but does not provide protection from unauthorized transactions by authorized users.",
    C: "Authentication techniques for sending and receiving messages play a key role in minimizing exposure to unauthorized transactions.",
    D: "Change control procedures do not resolve the issue of unauthorized transactions."
  },
  taskStatement:
    "Apply project management methodologies to the audit process",
  taskId: "T3"
},

{
  id: "D1-43",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "Which of the following is the MOST critical step when planning an information systems (IS) audit?",
  choices: {
    A: "Review findings from prior audits.",
    B: "Obtain executive management approval of the audit plan",
    C: "Review information security policies and procedures.",
    D: "Perform a risk assessment."
  },
  correctAnswer: "D",
  justification: {
    A: "The findings of a previous audit are of interest to the auditor, but they are not the most critical step. The most critical step involves finding the current issues or high-risk areas, not reviewing the resolution of older issues.",
    B: "Executive management is not required to approve the audit plan. It is typically approved by the audit committee or board of directors.",
    C: "Reviewing information security policies and procedures is normally conducted during fieldwork, not planning.",
    D: "Of all the steps listed, performing a risk assessment is the most critical. Risk assessment is required by ISACA IS Audit and Assurance Standard 1201."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-44",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "A financial institution with multiple branch offices has an automated control that requires the branch manager to approve transactions over a certain amount. What type of audit control is this?",
  choices: {
    A: "Detective",
    B: "Preventive",
    C: "Corrective",
    D: "Directive"
  },
  correctAnswer: "B",
  justification: {
    A: "Detective controls identify events after they have happened.",
    B: "Having a manager approve transactions over a certain amount is considered a preventive control.",
    C: "A corrective control serves to remedy problems discovered by detective controls.",
    D: "A directive control is a manual control that typically consists of a policy or procedure."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-45",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "The PRIMARY purpose of an IT forensic audit is:",
  choices: {
    A: "to participate in investigations related to corporate fraud.",
    B: "to enable the systematic collection and analysis of evidence after a system irregularity.",
    C: "To assess the correctness of an organization’s financial statements.",
    D: "to preserve evidence of criminal activity."
  },
  correctAnswer: "B",
  justification: {
    A: "Forensic audits are not limited to corporate fraud.",
    B: "The systematic collection and analysis of evidence after a system irregularity best describes a forensic audit.",
    C: "Assessing the correctness of an organization’s financial statements is not the primary purpose of most forensic audits.",
    D: "Preserving evidence is the forensic process, but not the primary purpose."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-46",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "What BEST describes the risk that information collected may contain a material error that may go undetected during information systems (IS) auditing?",
  choices: {
    A: "Inherent risk",
    B: "Audit risk",
    C: "Control risk",
    D: "Detection risk"
  },
  correctAnswer: "B",
  justification: {
    A: "Inherent risk is the risk level or exposure of the process/entity to be audited without considering the controls.",
    B: "Audit risk is the probability that information or financial reports may contain material errors and that the auditor may not detect an error that has occurred.",
    C: "Control risk is the risk that a material error exists that would not be prevented or detected on a timely basis.",
    D: "Detection risk is the risk that material errors will not be detected by an IS auditor."
  },
  taskStatement:
    "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
  taskId: "T4"
},

{
  id: "D1-47",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "While performing an audit of an accounting application’s internal data integrity controls, an information systems (IS) auditor identifies a major control deficiency in the change management software supporting the accounting application. The MOST appropriate action for the IS auditor to take is to:",
  choices: {
    A: "continue to test the accounting application controls and inform the IT manager about the control deficiency and recommend possible solutions.",
    B: "complete the audit and not report the control deficiency because it is not part of the audit scope.",
    C: "continue to test the accounting application controls and include the deficiency in the final report.",
    D: "cease all audit activity until the control deficiency is resolved."
  },
  correctAnswer: "C",
  justification: {
    A: "It is inappropriate to offer consulting services on issues discovered during an audit.",
    B: "It is the responsibility of the IS auditor to report findings discovered during an audit.",
    C: "It is the responsibility of the IS auditor to report on findings that can have a material impact on the effectiveness of controls.",
    D: "It is not the role of the IS auditor to demand that IT work be completed before completing an audit."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-48",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "Which of the following is the BEST source of information that the information systems (IS) auditor can use in assessing the process being audited?",
  choices: {
    A: "Interviews with a sample of employees from the IT department",
    B: "Current audit plan",
    C: "Past audit reports",
    D: "Recent control self-assessment"
  },
  correctAnswer: "D",
  justification: {
    A: "Interviews help understanding but are not the best source of information.",
    B: "The audit plan is created after understanding the business risk.",
    C: "Past audit reports may be outdated.",
    D: "CSA is made by the staff and management of the unit involved."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-49",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "The vice president of human resources has requested an information systems (IS) audit to identify payroll overpayments for the previous year. Which is the BEST audit technique to use in this situation?",
  choices: {
    A: "Generate sample test data",
    B: "Generalized audit software",
    C: "Integrated test facility",
    D: "Embedded audit module"
  },
  correctAnswer: "B",
  justification: {
    A: "Test data does not detect previous miscalculations.",
    B: "Generalized audit software can recompute payroll to determine overpayments.",
    C: "Integrated test facilities identify problems as they occur.",
    D: "Embedded audit modules do not detect past errors."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-50",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "Which of the following is a PRIMARY objective of embedding an audit module while developing online application systems?",
  choices: {
    A: "To collect evidence while transactions are processed",
    B: "To reduce requirements for periodic internal audits",
    C: "To identify and report fraudulent transactions",
    D: "To increase efficiency of the audit function"
  },
  correctAnswer: "A",
  justification: {
    A: "Embedding a module for continuous auditing provides timely collection of audit evidence during processing.",
    B: "It does not reduce the need for periodic audits.",
    C: "It does not inherently identify fraud.",
    D: "Increased efficiency is not the primary objective."
  },
  taskStatement:
    "Evaluate IT resource and project management for alignment with the organization's strategies and objectives",
  taskId: "T12"
},

{
  id: "D1-51",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "When the information systems (IS) auditor encounters instances or indicators of fraud during regular assurance work, what should the IS auditor do FIRST?",
  choices: {
    A: "Communicate with audit management.",
    B: "Escalate the issue to the audit committee.",
    C: "Report the fraud instance to appropriate authorities.",
    D: "Exercise careful analysis and evaluation ."
  },
  correctAnswer: "D",
  justification: {
    A: "Communication should occur after due professional care.",
    B: "Escalation occurs after further analysis.",
    C: "Reporting to authorities should occur after consultation.",
    D: "The IS auditor must exercise due professional care and further analysis."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-52",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "An enterprise has recently upgraded its purchase system to incorporate electronic data interchange (EDI) transmissions. Which of the following controls should be implemented in the EDI interface to provide efficient data mapping?",
  choices: {
    A: "Key verification",
    B: "One-for-one checking",
    C: "Manual recalculations",
    D: "Functional acknowledgments"
  },
  correctAnswer: "D",
  justification: {
    A: "Key verification is used for encryption and protection of data.",
    B: "One-for-one checking validates transactions but does not map data.",
    C: "Manual recalculations do not map data.",
    D: "Functional acknowledgments act as an audit trail and support data mapping."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-53",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "The PRIMARY advantage of a continuous audit approach is that it:",
  choices: {
    A: "does not require an information systems (IS) auditor to collect evidence on system reliability while processing is taking place.",
    B: "allows the IS auditor to review and follow up on audit issues in a timely manner.",
    C: "places the responsibility for enforcement and monitoring of controls on the security department instead of audit.",
    D: "simplifies the extraction and correlation of data from multiple and complex systems."
  },
  correctAnswer: "B",
  justification: {
    A: "Continuous audit often requires evidence collection during processing.",
    B: "Continuous audit allows audit and response to audit issues in a timely manner.",
    C: "Responsibility remains with management.",
    D: "Continuous audit is not based on system complexity."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-54",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "The decisions and actions of an information systems (IS) auditor are MOST likely to affect which of the following types of risk?",
  choices: {
    A: "Inherent",
    B: "Detection",
    C: "Control",
    D: "Business"
  },
  correctAnswer: "B",
  justification: {
    A: "Inherent risk is not usually affected by an IS auditor.",
    B: "Detection risk is directly affected by the IS auditor’s selection of audit procedures.",
    C: "Control risk is mitigated by management.",
    D: "Business risk is not directly affected by an IS auditor."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},
{
  id: "D1-55",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "An information systems (IS) auditor discovers that devices connected to the network are not included in a network diagram that had been used to develop the scope of the audit. The chief information officer explains that the diagram is being updated and awaiting final approval. The IS auditor should FIRST:",
  choices: {
    A: "expand the scope of the IS audit to include the devices that are not on the network diagram.",
    B: "evaluate the impact of the undocumented devices on the audit scope.",
    C: "note a control deficiency because the network diagram has not been approved.",
    D: "plan follow-up audits of the undocumented devices."
  },
  correctAnswer: "B",
  justification: {
    A: "It is important that the information systems (IS) auditor does not immediately assume that everything on the network diagram provides information about the risk affecting a network/system. There is a process in place for documenting and updating the network diagram.",
    B: "In a risk-based approach to an IS audit, the scope is determined by the impact that the devices will have on the audit. If the undocumented devices do not impact the audit scope, then they may be excluded from the current audit engagement.",
    C: "In this case, there is simply a mismatch in timing between the completion of the approval process and when the IS audit began. There is no control deficiency to be reported.",
    D: "Planning for follow-up audits of the undocumented devices is contingent on the risk that the undocumented devices have on the ability of the entity to meet the audit scope."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-56",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "Which of the following should an information systems (IS) auditor use to detect duplicate invoice records within an invoice master file?",
  choices: {
    A: "Attribute sampling",
    B: "Computer-assisted audit techniques (CAATs)",
    C: "Compliance testing",
    D: "Integrated test facility"
  },
  correctAnswer: "B",
  justification: {
    A: "Attribute sampling aids in identifying records meeting specific conditions but does not compare one record to another to identify duplicates.",
    B: "Computer-assisted audit techniques (CAATs) enable the IS auditor to review the entire invoice file to look for those items that meet the selection criteria.",
    C: "Compliance testing determines whether control procedures are adhered to.",
    D: "An integrated test facility allows the IS auditor to test transactions through the production system but does not compare records to identify duplicates."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-57",
  domain: "1 - Information System Auditing Process",
  category: "Audit Evidence Collection Techniques",
  question:
    "An information systems (IS) auditor has been asked to audit the change management process in IT covering all operational systems. Which of the following documents will BEST aid the auditor in defining the scope for the audit project?",
  choices: {
    A: "Enterprise architecture",
    B: "Control catalog",
    C: "Risk register",
    D: "IT organizational chart"
  },
  correctAnswer: "A",
  justification: {
    A: "Because the objective covers the change management process for all IT systems, the auditor needs to understand the environment to define the audit scope. The enterprise architecture document is the best aid to use to accomplish this.",
    B: "The control catalog is required for an auditor to plan the testing of controls, which is the next step after defining scope.",
    C: "The risk register is useful in planning the audit for determining systems to be audited on priority based on associated risk but not in defining the scope of the audit.",
    D: "The IT organizational chart is useful for planning to understand the flow of process but is not the most helpful in determining the scope of the audit."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-58",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "An information systems (IS) audit department considers implementing continuous auditing techniques for a multinational retail enterprise that requires high availability of its key systems. A PRIMARY benefit of continuous auditing is that:",
  choices: {
    A: "Effective preventive controls are enforced.",
    B: "System integrity is ensured.",
    C: "Errors can be corrected in a timely fashion.",
    D: "Fraud can be detected more quickly."
  },
  correctAnswer: "D",
  justification: {
    A: "Continuous monitoring is detective in nature and, therefore, does not necessarily assist the information systems (IS) auditor in monitoring for preventive controls.",
    B: "System integrity is typically associated with preventive controls.",
    C: "Continuous audit will detect errors but not correct them.",
    D: "Continuous auditing techniques assist the auditing function in identifying fraud in a timely fashion."
  },
  taskStatement:
    "Evaluate the organization's enterprise risk management (ERM) program",
  taskId: "T13"
},

{
  id: "D1-59",
  domain: "1 - Information System Auditing Process",
  category: "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
  question:
    "An IT auditor reviewed the transactions log of an audit engagement partner and discovered some suspicious activity, which may be interpreted as potential fraud. However, the auditor was not able to determine the circumstances around the incidents or obtain further evidence. The auditor decided to disclose this information in case there are questions in the audit quality assurance review. In taking this action, the auditor has:",
  choices: {
    A: "violated auditing standards because the auditor should inform the appropriate authorities/management of the suspected fraud.",
    B: "violated laws because unlawful activities should have been reported to the appropriate regulatory agency.",
    C: "not violated auditing standards because the auditor has committed to disclose the facts, when required.",
    D: "not violated auditing standards because there is a lack of evidence as to whether a fraud has been committed or not."
  },
  correctAnswer: "A",
  justification: {
    A: "Auditors should disclose all material facts and findings known to them that, if not disclosed, may distort the reporting of activities under review.",
    B: "Unlawful activities should not be reported to the outside entities until there is sufficient evidence.",
    C: "The auditor has a duty to act even though the available facts do not prove that an irregularity has occurred.",
    D: "A possible irregularity should be disclosed to the appropriate enterprise authorities."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-60",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "An information systems (IS) auditor is testing employee access to a large financial system and selects a sample from the current employee list provided by the auditee. Which of the following evidence is the MOST reliable to support the testing?",
  choices: {
    A: "A spreadsheet provided by the system administrator",
    B: "Human resources access documents signed by employees’ managers",
    C: "A list of accounts with access levels generated by the system",
    D: "Observations performed onsite in the presence of a system administrator"
  },
  correctAnswer: "C",
  justification: {
    A: "A spreadsheet supplied by the system administrator may not be complete or may be inaccurate.",
    B: "The human resources access documents are not as objective as the system-generated access list.",
    C: "The access list generated by the system is the most reliable because it is the most objective evidence.",
    D: "Observations are not efficient for many users and are not objective enough for substantive tests."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-61",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "The PRIMARY reason an information systems (IS) auditor performs a functional walk-through during the preliminary phase of an audit assignment is to:",
  choices: {
    A: "understand the business process.",
    B: "comply with auditing standards.",
    C: "identify control weakness.",
    D: "develop the risk assessment."
  },
  correctAnswer: "A",
  justification: {
    A: "Understanding the business process is the first step that an information systems (IS) auditor needs to perform.",
    B: "Standards do not require an IS auditor to perform a process walk-through at the commencement of an audit engagement.",
    C: "Identifying control weaknesses typically occurs at a later stage in the audit.",
    D: "The risk assessment is developed after the business process is understood."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-62",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "An information systems (IS) auditor is developing an audit plan for an environment that includes new systems. Enterprise management wants the IS auditor to focus on recently implemented systems. How should the IS auditor respond?",
  choices: {
    A: "Audit the new systems as requested by management.",
    B: "Audit systems not included in last year’s scope.",
    C: "Determine the highest-risk systems and plan accordingly.",
    D: "Audit systems not in last year’s scope and the new systems."
  },
  correctAnswer: "C",
  justification: {
    A: "Auditing the new systems does not reflect a risk-based approach.",
    B: "Auditing systems not included in the previous year’s scope does not reflect a risk-based approach.",
    C: "The best action is to conduct a risk assessment and design the audit plan to cover the areas of highest risk.",
    D: "The IS auditor should not arbitrarily decide on what needs to be audited."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-63",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "The MOST effective audit practice to determine whether controls accurately support the operational effectiveness of transaction processing is:",
  choices: {
    A: "control design testing.",
    B: "substantive testing.",
    C: "inspection of relevant documentation.",
    D: "perform tests on risk prevention."
  },
  correctAnswer: "B",
  justification: {
    A: "Testing of control design does not help determine whether the control is operating effectively.",
    B: "Tests of controls are the most effective procedures to assess operational effectiveness.",
    C: "Control documents may not always describe the actual process accurately.",
    D: "Performing tests on risk prevention is considered compliance testing."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-64",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "Which of the following is the FIRST step performed prior to creating a risk ranking for the annual internal information systems (IS) audit plan?",
  choices: {
    A: "Prioritize the identified risk.",
    B: "Define the audit universe.",
    C: "Identify the critical controls.",
    D: "Determine the testing approach."
  },
  correctAnswer: "B",
  justification: {
    A: "Risk is prioritized after the audit universe is defined.",
    B: "The auditor must first define the audit universe before ranking risk.",
    C: "Critical controls are identified after risk ranking.",
    D: "The testing approach is based on the risk ranking."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-65",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "Why does an audit manager review the staff audit papers, even when the information systems (IS) auditors have many years of experience?",
  choices: {
    A: "Internal quality requirements",
    B: "Audit guidelines",
    C: "Audit methodology",
    D: "Professional standards"
  },
  correctAnswer: "D",
  justification: {
    A: "Internal quality requirements are superseded by professional standards.",
    B: "Audit guidelines provide guidance but do not mandate supervision.",
    C: "Audit methodology supports audit execution but does not replace supervision.",
    D: "Professional standards require supervision of audit staff."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-66",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "An information systems (IS) auditor notes daily reconciliation of visitor access card inventory is not aligned with the organization’s procedures. Which of the following is the auditor’s BEST course of action?",
  choices: {
    A: "Do not report the lack of reconciliation.",
    B: "Recommend regular physical inventory counts.",
    C: "Report the lack of daily reconciliations.",
    D: "Recommend the implementation of a more secure access system."
  },
  correctAnswer: "C",
  justification: {
    A: "Absence of discrepancy cannot be a reason to overlook failure of operation of the control.",
    B: "The primary goal is to observe and report when the current process is deficient.",
    C: "The IS auditor should report the lack of daily reconciliation as an exception.",
    D: "The primary goal is to observe and report when the current process is deficient."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-67",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "What is the MAIN benefit of implementing a risk-based audit? A risk-based audit approach:",
  choices: {
    A: "links internal auditing to the enterprise’s overall risk management framework.",
    B: "ensures that risk, risk responses and actions are being properly classified and reported.",
    C: "helps to identify residual risk not in line with the risk appetite.",
    D: "allows auditors to provide assurance to the board of directors that risk management processes are managing risk effectively in relation to the risk appetite."
  },
  correctAnswer: "D",
  justification: {
    A: "This is a benefit but not the main benefit.",
    B: "This is an outcome of the risk-based audit.",
    C: "This is an outcome but not the main benefit.",
    D: "The main benefit is to assure senior management about the efficacy of risk management processes."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-68",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "Which of the following is MOST likely to be considered a conflict of interest for an information systems (IS) auditor who is reviewing a cybersecurity implementation?",
  choices: {
    A: "Delivering cybersecurity awareness training",
    B: "Designing the cybersecurity controls",
    C: "Advising on the cybersecurity framework",
    D: "Conducting the vulnerability assessment"
  },
  correctAnswer: "B",
  justification: {
    A: "This is not as strong a conflict of interest.",
    B: "If an auditor designs the controls, a conflict of interest arises.",
    C: "Advising is acceptable provided it does not rise to designing controls.",
    D: "Conducting a vulnerability assessment does not present a conflict of interest."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-69",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "Which of the following would MOST likely be used to establish the objectives and coverage of an audit?",
  choices: {
    A: "Prior audit reports",
    B: "Business strategy",
    C: "Risk assessment reports",
    D: "Audit deliverables"
  },
  correctAnswer: "C",
  justification: {
    A: "Prior audit reports may not represent current risk.",
    B: "Business strategy cannot be used to establish audit objectives.",
    C: "Audit objectives and coverage should always be based on the risk.",
    D: "Audit deliverables are outputs of the audit."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-70",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "Which of the following is the MOST essential input required for a risk-based audit planning?",
  choices: {
    A: "Internal controls and procedures description",
    B: "Action report on previous years’ audit findings",
    C: "Information security policies and procedures",
    D: "Availability of resources and project timeline"
  },
  correctAnswer: "A",
  justification: {
    A: "A description of internal controls and procedures is the most essential input required in planning control testing based on the risk being mitigated.",
    B: "This information is useful in reporting rather than planning.",
    C: "Security policies help determine controls to be tested but do not directly help in risk-based audit planning.",
    D: "Resource availability is required but not the most essential input."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-71",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "During a compliance audit of a small bank, the information systems (IS) auditor notes that the IT and accounting functions are being performed by the same user of the financial system. Which of the following reviews that are conducted by the user’s supervisor represents the BEST compensating control?",
  choices: {
    A: "Audit trails that show the date and time of the transaction",
    B: "A daily report with the total numbers and dollar amounts of each transaction",
    C: "User account administration",
    D: "Computer log files that show individual transactions"
  },
  correctAnswer: "D",
  justification: {
    A: "An audit trail of only the date and time of the transaction is not sufficient.",
    B: "Review of summary reports does not compensate for the separation of duties issue.",
    C: "User account administration may not detect inappropriate activities.",
    D: "Computer logs record activities of individuals and abnormal activities."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-72",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "Which of the following should be the FIRST step for the information systems (IS) auditor to take when planning for an audit?",
  choices: {
    A: "Understand internal controls.",
    B: "Perform compliance tests.",
    C: "Gather information and plan.",
    D: "Perform substantive tests."
  },
  correctAnswer: "C",
  justification: {
    A: "Understanding internal controls comes after information gathering.",
    B: "Compliance tests are performed during the audit.",
    C: "The first step in planning an audit is gathering information.",
    D: "Substantive tests are performed during the audit."
  },
  taskStatement:
    "Plan an audit to determine whether information systems are protected, controlled, and provide value to the organization",
  taskId: "T1"
},

{
  id: "D1-73",
  domain: "1 - Information System Auditing Process",
  category: "Risk-Based Audit Planning",
  question:
    "Which of the following is the BEST factor for determining the required extent of data collection during the planning phase of an information systems (IS) compliance audit?",
  choices: {
    A: "Complexity of the organization’s operation",
    B: "Findings and issues noted from the prior year",
    C: "Purpose, objective and scope of the audit",
    D: "Auditor’s familiarity with the organization"
  },
  correctAnswer: "C",
  justification: {
    A: "Complexity does not directly affect how much data to collect.",
    B: "Prior findings do not directly affect the extent of data collection.",
    C: "The extent of data collection is related directly to the purpose, objective and scope of the audit.",
    D: "Familiarity should not influence data collection."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},
{
  id: "D1-74",
  domain: "1 - Information System Auditing Process",
  category: "Types of Controls and Considerations",
  question:
    "Which of the following is the MOST important skill that an information systems (IS) auditor should develop to understand the constraints of conducting an audit?",
  choices: {
    A: "Managing audit staff",
    B: "Allocating resources",
    C: "Project management",
    D: "Attention to detail"
  },
  correctAnswer: "C",
  justification: {
    A: "Managing audit staff is not the only aspect of conducting an audit.",
    B: "Allocating resources, such as time and personnel, is needed for overall project management skills.",
    C: "Audits often involve resource management, deliverables, scheduling and deadlines that are similar to project management good practices.",
    D: "Attention to detail is needed, but it is not a constraint of conducting audits."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-75",
  domain: "1 - Information System Auditing Process",
  category: "Types of Controls and Considerations",
  question:
    "For which of the following controls would an information systems (IS) auditor look in an environment where duties cannot be appropriately segregated?",
  choices: {
    A: "Overlapping controls",
    B: "Boundary controls",
    C: "Access controls",
    D: "Compensating controls"
  },
  correctAnswer: "D",
  justification: {
    A: "Overlapping controls are two controls addressing the same control objective or exposure.",
    B: "Boundary controls establish the interface between the would-be user of a computer system and the computer system itself.",
    C: "Access controls for resources are based on individuals and not on roles.",
    D: "Compensating controls are internal controls that are intended to reduce the risk of an existing or potential control weakness that may arise when duties cannot be appropriately segregated."
  },
  taskStatement:
    "Evaluate logical, physical, and environmental controls to verify the confidentiality, integrity, and availability of information assets",
  taskId: "T40"
},

{
  id: "D1-76",
  domain: "1 - Information System Auditing Process",
  category: "Types of Controls and Considerations",
  question:
    "Which of the following BEST describes the objective of an information systems (IS) auditor discussing the audit findings with the auditee?",
  choices: {
    A: "Communicate results to the auditee.",
    B: "Develop timelines for the implementation of suggested recommendations.",
    C: "Confirm the findings and propose a course of corrective action.",
    D: "Identify compensating controls to the identified risk."
  },
  correctAnswer: "C",
  justification: {
    A: "Based on this discussion, the information systems (IS) auditor will finalize the report and present the report to relevant levels of senior management after the findings are confirmed.",
    B: "This discussion informs management of the findings of the audit.",
    C: "Before communicating the results of an audit to senior management, the IS auditor should discuss the findings with the auditee.",
    D: "The purpose of the meeting is to validate the findings of the audit with management."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-77",
  domain: "1 - Information System Auditing Process",
  category: "Types of Controls and Considerations",
  question:
    "Which of the following is MOST important for an information systems (IS) auditor to understand when auditing an ecommerce environment?",
  choices: {
    A: "The technology architecture of the ecommerce environment",
    B: "The policies, procedures and practices forming the control environment",
    C: "The nature and criticality of the business processes supported by the application",
    D: "Continuous monitoring of control measures for system availability and reliability"
  },
  correctAnswer: "C",
  justification: {
    A: "Understanding the technology architecture of the ecommerce environment is important.",
    B: "This is not the most important element that the information systems (IS) auditor needs to understand.",
    C: "The ecommerce application enables the execution of business transactions.",
    D: "Availability is only one of the aspects to be considered."
  },
  taskStatement:
    "Evaluate logical, physical, and environmental controls to verify the confidentiality, integrity, and availability of information assets",
  taskId: "T40"
},

{
  id: "D1-78",
  domain: "1 - Information System Auditing Process",
  category: "Types of Controls and Considerations",
  question:
    "Which of the following is evaluated as a preventive control by an information systems (IS) auditor performing an audit?",
  choices: {
    A: "Transaction logs",
    B: "Before and after image reporting",
    C: "Table lookups",
    D: "Tracing and tagging"
  },
  correctAnswer: "C",
  justification: {
    A: "Transaction logs are a detective control and provide audit trails.",
    B: "Before and after image reporting is a detective control.",
    C: "Table lookups are preventive controls; input data are checked against predefined tables.",
    D: "Tracing and tagging is used to test application systems and controls."
  },
  taskStatement:
    "Evaluate logical, physical, and environmental controls to verify the confidentiality, integrity, and availability of information assets",
  taskId: "T40"
},

{
  id: "D1-79",
  domain: "1 - Information System Auditing Process",
  category: "Types of Controls and Considerations",
  question:
    "The MAIN purpose of the annual information systems (IS) audit plan is to:",
  choices: {
    A: "Allocate resources for audits.",
    B: "Reduce the impact of audit risk.",
    C: "Develop a training plan for auditors.",
    D: "Minimize the audit costs."
  },
  correctAnswer: "A",
  justification: {
    A: "Because information systems (IS) audit assignments need to be accomplished with limited time and human resources.",
    B: "Audit risk is inherent to all audits.",
    C: "Developing a training plan is not the main purpose of an IS audit plan.",
    D: "Minimizing the audit costs would be a result of effective resource usage."
  },
  taskStatement:
    "Evaluate audit processes as part of quality assurance and improvement programs",
  taskId: "T8"
},

{
  id: "D1-80",
  domain: "1 - Information System Auditing Process",
  category: "Types of Controls and Considerations",
  question:
    "An information systems (IS) auditor reviewing the process of log monitoring wants to evaluate the organization’s manual review process. Which of the following audit techniques would the auditor MOST likely employ to fulfill this purpose?",
  choices: {
    A: "Inspection",
    B: "Inquiry",
    C: "Walk-through",
    D: "Reperformance"
  },
  correctAnswer: "C",
  justification: {
    A: "Inspection is just one component of a walk-through.",
    B: "Inquiry provides only general information.",
    C: "Walk-through procedures usually include a combination of inquiry, observation, inspection and reperformance.",
    D: "Reperformance does not provide assurance of the competency of the auditee."
  },
  taskStatement:
    "Evaluate logical, physical, and environmental controls to verify the confidentiality, integrity, and availability of information assets",
  taskId: "T40"
},

{
  id: "D1-81",
  domain: "1 - Information System Auditing Process",
  category: "Types of Controls and Considerations",
  question:
    "An organization’s information systems (IS) audit charter should specify the:",
  choices: {
    A: "Plans for IS audit engagements.",
    B: "Objectives and scope of IS audit engagements.",
    C: "Detailed training plan for the IS audit staff.",
    D: "Role of the IS audit function."
  },
  correctAnswer: "D",
  justification: {
    A: "Planning is the responsibility of audit management.",
    B: "The charter specifies the objectives and scope of the audit function.",
    C: "A training plan should be developed by audit management.",
    D: "An IS audit charter establishes the role of the information systems audit function."
  },
  taskStatement:
    "Plan an audit to determine whether information systems are protected, controlled, and provide value to the organization",
  taskId: "T1"
},

{
  id: "D1-82",
  domain: "1 - Information System Auditing Process",
  category: "Types of Controls and Considerations",
  question:
    "Which of the following is the MAIN reason to perform a risk assessment in the planning phase of an information systems (IS) audit?",
  choices: {
    A: "To ensure that management concerns are addressed",
    B: "To provide reasonable assurance that material items will be addressed",
    C: "To ensure that the audit team will perform audits within budget",
    D: "To develop audit program and procedures needed to perform the audit"
  },
  correctAnswer: "B",
  justification: {
    A: "Management concerns have no bearing on the risk assessment process.",
    B: "A risk assessment helps to focus the audit procedures on the highest risk areas.",
    C: "Budget constraints are not the purpose of risk assessment.",
    D: "Risk assessment is not used to develop audit procedures."
  },
  taskStatement:
    "Evaluate the organization's threat and vulnerability management program",
  taskId: "T38"
},

{
  id: "D1-83",
  domain: "1 - Information System Auditing Process",
  category: "Types of Controls and Considerations",
  question:
    "During a risk analysis, an information systems (IS) auditor identifies threats and potential impacts. Next, the IS auditor should:",
  choices: {
    A: "Ensure that the risk assessment is aligned to management’s risk assessment process.",
    B: "Identify information assets and the underlying systems.",
    C: "Disclose the threats and impacts to management.",
    D: "Identify and evaluate the existing controls."
  },
  correctAnswer: "D",
  justification: {
    A: "An audit risk assessment is conducted for purposes that are different from management’s risk assessment.",
    B: "Assets must already have been identified.",
    C: "Controls must be evaluated before communicating risk.",
    D: "It is important for an IS auditor to identify and evaluate the existence and effectiveness of existing and planned controls."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-84",
  domain: "1 - Information System Auditing Process",
  category: "Types of Controls and Considerations",
  question:
    "An information systems (IS) auditor discovers a potential material finding. The BEST course of action is to:",
  choices: {
    A: "Report the potential finding to business management.",
    B: "Discuss the potential finding with the audit committee.",
    C: "Increase the scope of the audit.",
    D: "Perform additional testing."
  },
  correctAnswer: "D",
  justification: {
    A: "The item should be confirmed through additional testing before it is reported.",
    B: "The item should be confirmed before discussion with the audit committee.",
    C: "Increasing the scope can demand more resources.",
    D: "The information systems (IS) auditor should perform additional testing."
  },
  taskStatement:
    "Evaluate whether the business cases related to information systems meet business objectives",
  taskId: "T18"
},

{
  id: "D1-85",
  domain: "1 - Information System Auditing Process",
  category: "Types of Controls and Considerations",
  question:
    "Which of the following is MOST effective for monitoring transactions exceeding predetermined thresholds?",
  choices: {
    A: "Generalized audit software (GAS)",
    B: "An integrated test facility",
    C: "Regression tests",
    D: "Transaction snapshots"
  },
  correctAnswer: "A",
  justification: {
    A: "Generalized audit software (GAS) is a data analytics tool that can be used to filter large amounts of data.",
    B: "Integrated test facilities cannot be used to monitor real-time transactions.",
    C: "Regression tests are used to test new versions of software.",
    D: "Snapshots alone are not sufficient."
  },
  taskStatement:
    "Evaluate logical, physical, and environmental controls to verify the confidentiality, integrity, and availability of information assets",
  taskId: "T40"
},

{
  id: "D1-86",
  domain: "1 - Information System Auditing Process",
  category: "Types of Controls and Considerations",
  question:
    "In a risk-based information systems (IS) audit, where both inherent and control risk have been assessed as high, an IS auditor would MOST likely compensate for this scenario by performing additional:",
  choices: {
    A: "Stop-or-go sampling.",
    B: "Substantive testing.",
    C: "Compliance testing.",
    D: "Discovery sampling."
  },
  correctAnswer: "B",
  justification: {
    A: "Stop-or-go sampling is not the best type of testing in this case.",
    B: "Substantive testing obtains audit evidence on completeness, accuracy, or existence.",
    C: "Compliance testing is not sufficient in this case.",
    D: "Discovery sampling is typically used to test for fraud."
  },
  taskStatement:
    "Evaluate logical, physical, and environmental controls to verify the confidentiality, integrity, and availability of information assets",
  taskId: "T40"
},

{
  id: "D1-87",
  domain: "1 - Information System Auditing Process",
  category: "Types of Controls and Considerations",
  question:
    "Which of the following does a lack of adequate controls represent?",
  choices: {
    A: "An impact",
    B: "A vulnerability",
    C: "An asset",
    D: "A threat"
  },
  correctAnswer: "B",
  justification: {
    A: "Impact is the measure of the consequence.",
    B: "The lack of adequate controls represents a vulnerability.",
    C: "An asset is something of value worth protecting.",
    D: "A threat is a potential cause of an unwanted incident."
  },
  taskStatement:
    "Evaluate logical, physical, and environmental controls to verify the confidentiality, integrity, and availability of information assets",
  taskId: "T40"
},

{
  id: "D1-88",
  domain: "1 - Information System Auditing Process",
  category: "Types of Controls and Considerations",
  question:
    "A centralized antivirus system determines whether each personal computer has the latest signature files and installs the latest signature files before allowing a PC to connect to the network. This is an example of a:",
  choices: {
    A: "Directive control.",
    B: "Corrective control.",
    C: "Compensating control.",
    D: "Detective control."
  },
  correctAnswer: "B",
  justification: {
    A: "Directive controls do not apply in this case.",
    B: "Corrective controls are designed to correct errors and unauthorized intrusions.",
    C: "A compensating control is used where other controls are not sufficient.",
    D: "Detective controls detect and report events."
  },
  taskStatement:
    "Evaluate controls at all stages of the information systems development life cycle",
  taskId: "T21"
},

{
  id: "D1-89",
  domain: "1 - Information System Auditing Process",
  category: "Types of Controls and Considerations",
  question:
    "Which of the following would be MOST useful for an information systems (IS) auditor for accessing and analyzing digital data to collect relevant audit evidence from diverse software environments?",
  choices: {
    A: "Structured Query Language (SQL)",
    B: "Application software reports",
    C: "Data analytics controls",
    D: "Computer-assisted auditing techniques (CAATs)"
  },
  correctAnswer: "D",
  justification: {
    A: "SQL requires knowledge of database structures.",
    B: "Reports are not as beneficial as CAATs.",
    C: "Data analytics controls are not as comprehensive.",
    D: "CAATs are tools used for accessing data in an electronic form from diverse software environments."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-90",
  domain: "1 - Information System Auditing Process",
  category: "Types of Controls and Considerations",
  question:
    "Which of the following is the FIRST step in an IT risk assessment for a risk-based audit?",
  choices: {
    A: "Identify all IT systems and controls that are relevant to audit objectives.",
    B: "List all controls from the audit program.",
    C: "Review the results of a risk self-assessment.",
    D: "Understand the business, its operating model and key processes."
  },
  correctAnswer: "D",
  justification: {
    A: "Understanding the business environment comes first.",
    B: "This step follows understanding the business environment.",
    C: "A risk self-assessment is optional.",
    D: "Risk-based auditing must be based on an understanding of the business."
  },
  taskStatement:
    "Plan an audit to determine whether information systems are protected, controlled, and provide value to the organization",
  taskId: "T1"
},

{
  id: "D1-91",
  domain: "1 - Information System Auditing Process",
  category: "Types of Controls and Considerations",
  question:
    "The MAIN advantage of an information systems (IS) auditor directly extracting data from a general ledger system is:",
  choices: {
    A: "Reduction of human resources needed to support the audit.",
    B: "Reduction in the time to have access to the information.",
    C: "Greater flexibility for the audit department.",
    D: "Greater assurance of data validity."
  },
  correctAnswer: "D",
  justification: {
    A: "This advantage is not as significant as increased data validity.",
    B: "This does not necessarily reduce access time.",
    C: "Flexibility is not the main advantage.",
    D: "If the IS auditor executes the data extraction, there is greater assurance of data validity."
  },
  taskStatement:
    "Evaluate logical, physical, and environmental controls to verify the confidentiality, integrity, and availability of information assets",
  taskId: "T40"
},
{
  id: "D1-92",
  domain: "1 - Information System Auditing Process",
  category: "Quality Assurance and Improvement of Audit Process",
  question:
    "Which of the following is the MOST important factor in ensuring the success of a new audit quality assurance (QA) program?",
  choices: {
    A: "Using a systematic approach to develop the program",
    B: "Defining clear and measurable objectives and goals",
    C: "Ensuring that continuous improvement efforts are embedded in the program",
    D: "Obtaining commitment and support from senior management"
  },
  correctAnswer: "D",
  justification: {
    A: "Using a systematic approach is one factor in developing the quality assurance (QA) program, but the most important factor is the commitment of the enterprise’s senior management.",
    B: "Identifying the objective criteria is one factor in developing the quality assurance program, but the most important factor is the commitment of the enterprise’s senior management.",
    C: "Continuous improvement is an important factor in developing the QA program, but the most important factor is the commitment of the enterprise’s senior management.",
    D: "The success of any QA program depends on the commitment of senior management. Without senior management support, the program is unlikely to be successful. Senior management must provide the resources necessary for the program to succeed and create a culture that supports continuous improvement. The most critical factor in guaranteeing the success of a new audit QA program is the commitment and support from the senior management."
  },
  taskStatement:
    "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
  taskId: "T4"
},

{
  id: "D1-93",
  domain: "1 - Information System Auditing Process",
  category: "Quality Assurance and Improvement of Audit Process",
  question:
    "Which of the following is the PRIMARY objective of a quality assurance (QA) and improvement program for an audit process?",
  choices: {
    A: "To ensure that all audit findings are accepted, addressed and resolved on time",
    B: "To provide a basis for evaluating the effectiveness and efficiency of the audit process",
    C: "To ensure that auditors are adequately trained, qualified and competent to perform audits",
    D: "To establish standard procedures for conducting audits, analyzing evidence and reporting findings"
  },
  correctAnswer: "B",
  justification: {
    A: "Although ensuring that audit findings are addressed and resolved on time is an important aspect of quality assurance (QA), it is not the primary objective.",
    B: "A QA and improvement program for an audit process is designed to evaluate the effectiveness and efficiency of the audit process and identify areas for improvement.",
    C: "Ensuring that auditors are adequately trained and qualified is important but not the primary objective of a quality assurance and improvement program.",
    D: "Establishing standard procedures is important but not the primary objective of a quality assurance and improvement program."
  },
  taskStatement:
    "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
  taskId: "T4"
},

{
  id: "D1-94",
  domain: "1 - Information System Auditing Process",
  category: "Quality Assurance and Improvement of Audit Process",
  question:
    "The success of a control self-assessment (CSA) depends highly on:",
  choices: {
    A: "Line managers assuming a portion of the responsibility for control monitoring.",
    B: "Assigning staff managers the responsibility for building controls.",
    C: "The implementation of a stringent control policy and rule-driven controls.",
    D: "The implementation of supervision and monitoring of controls of assigned duties."
  },
  correctAnswer: "A",
  justification: {
    A: "The primary objective of a control self-assessment (CSA) program is to leverage the internal audit function by shifting some of the control monitoring responsibilities to the functional area line managers.",
    B: "CSA requires managers to participate in the monitoring of controls.",
    C: "The implementation of stringent controls will not ensure controls are working correctly.",
    D: "Better supervision is a compensating and detective control and may assist in ensuring control effectiveness."
  },
  taskStatement:
    "Evaluate whether IT operations and maintenance practices support the organization's objectives",
  taskId: "T27"
},

{
  id: "D1-95",
  domain: "1 - Information System Auditing Process",
  category: "Quality Assurance and Improvement of Audit Process",
  question:
    "Which of the following is a KEY benefit of a control self-assessment (CSA)?",
  choices: {
    A: "Management ownership of the internal controls supporting business objectives is reinforced.",
    B: "Audit expenses are reduced when the assessment results are an input to external audit work.",
    C: "Fraud detection is improved because internal business staff are engaged in testing controls.",
    D: "Internal auditors can shift to a consultative approach by using the results of the assessment."
  },
  correctAnswer: "A",
  justification: {
    A: "The objective of control self-assessment (CSA) is to have business management become more aware of the importance of internal control and their responsibility in terms of corporate governance.",
    B: "Reducing audit expenses is not a key benefit of CSA.",
    C: "Improved fraud detection is important but not a principal objective of CSA.",
    D: "This is an additional benefit, not the key benefit."
  },
  taskStatement:
    "Evaluate audit processes as part of quality assurance and improvement programs",
  taskId: "T8"
},

{
  id: "D1-96",
  domain: "1 - Information System Auditing Process",
  category: "Quality Assurance and Improvement of Audit Process",
  question:
    "An enterprise adopted a policy of periodic verification of IT assets through control self-assessment (CSA). Which of the following is the BEST approach for an information systems (IS) auditor of the enterprise?",
  choices: {
    A: "The IS auditor should actively participate in the CSA for asset verification.",
    B: "The IS auditor should suggest that the enterprise incentivize the CSA exercise.",
    C: "The IS auditor should review the CSA outcome and look for other internal controls in place.",
    D: "The IS auditor should recuse from the CSA exercise, citing repetition/redundancy of work."
  },
  correctAnswer: "C",
  justification: {
    A: "The auditor should act as a facilitator, not an audit participant.",
    B: "Control self-assessment (CSA) should not be considered an extra activity.",
    C: "CSA alone may be mistaken as an audit function replacement; therefore, internal controls must exist and the IS auditor must look for them.",
    D: "CSA cannot replace the audit function."
  },
  taskStatement:
    "Evaluate the organization's management of IT policies and practices, including compliance with legal and regulatory requirements",
  taskId: "T11"
},

{
  id: "D1-97",
  domain: "1 - Information System Auditing Process",
  category: "Quality Assurance and Improvement of Audit Process",
  question:
    "An information systems (IS) auditor uses computer-assisted audit techniques (CAATs) to collect and analyze data. Which of the following attributes of evidence is MOST affected by using CAATs?",
  choices: {
    A: "Usefulness",
    B: "Reliability",
    C: "Relevance",
    D: "Adequacy"
  },
  correctAnswer: "B",
  justification: {
    A: "Usefulness of audit evidence pulled by computer-assisted audit techniques (CAATs) is determined by the audit objective.",
    B: "Because the data are directly collected by the information systems (IS) auditor, the audit findings can be reported with an emphasis on the reliability of the records.",
    C: "Relevance of audit evidence pulled by CAATs is determined by the audit objective.",
    D: "Adequacy of audit evidence pulled by CAATs is determined by the processes and personnel who author the data."
  },
  taskStatement:
    "Evaluate audit processes as part of quality assurance and improvement programs",
  taskId: "T8"
},

{
  id: "D1-98",
  domain: "1 - Information System Auditing Process",
  category: "Quality Assurance and Improvement of Audit Process",
  question:
    "Which of the following is the BEST approach for an information systems (IS) auditor evaluating IT-related controls as a member of an integrated audit team?",
  choices: {
    A: "Perform IT audits independently and submit findings to the audit manager to include in the final report.",
    B: "Prioritize control testing based on the complexity of the technology implemented by the enterprise.",
    C: "Include in the audit report the impact to the business due to weaknesses found in IT controls.",
    D: "Discuss the findings with the audit manager and afterwards submit the IT audit report to auditee’s management."
  },
  correctAnswer: "C",
  justification: {
    A: "Describing the business impact will help the audit manager prepare meaningful reporting.",
    B: "Prioritization based on business risk is better than complexity.",
    C: "Describing the business impact due to weaknesses in IT-related controls best helps auditee management.",
    D: "Discussing findings may not be effective unless the impact has been described in business terms."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-99",
  domain: "1 - Information System Auditing Process",
  category: "Quality Assurance and Improvement of Audit Process",
  question:
    "While reviewing a quality management system, the information systems (IS) auditor should PRIMARILY focus on collecting evidence to show that:",
  choices: {
    A: "Quality management systems comply with good practices.",
    B: "Continuous improvement targets are being monitored.",
    C: "Standard operating procedures are updated annually.",
    D: "Key performance indicators are defined."
  },
  correctAnswer: "B",
  justification: {
    A: "Conforming to good practices may or may not be a business requirement.",
    B: "Continuous and measurable improvement of quality is the primary requirement.",
    C: "Updating procedures must be part of change management.",
    D: "Indicators are of little value if they are not monitored."
  },
  taskStatement:
    "Evaluate audit processes as part of quality assurance and improvement programs",
  taskId: "T8"
},

{
  id: "D1-100",
  domain: "1 - Information System Auditing Process",
  category: "Quality Assurance and Improvement of Audit Process",
  question:
    "Which of the following sampling methods is the MOST effective to determine whether purchase orders issued to vendors have been authorized as per the authorization matrix?",
  choices: {
    A: "Variable sampling",
    B: "Stratified mean per unit",
    C: "Attribute sampling",
    D: "Unstratified mean per unit"
  },
  correctAnswer: "C",
  justification: {
    A: "Variable sampling is used for substantive testing.",
    B: "Stratified mean per unit is used in variable sampling.",
    C: "Attribute sampling is the method used for compliance testing.",
    D: "Unstratified mean per unit is used in variable sampling."
  },
  taskStatement:
    "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
  taskId: "T4"
},
{
  id: "D1-101",
  domain: "1 - Information System Auditing Process",
  category: "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
  question:
    "Which of the following BEST represents an ethical responsibility of project auditors?",
  choices: {
    A: "Auditors are permitted to divulge propriety information to which they might have access to support the auditee’s goals.",
    B: "Auditors should discuss the outcomes of previous audit exercises conducted elsewhere during the audit to ensure completeness.",
    C: "Audit team leaders must demonstrate fairness when settling disputes among members.",
    D: "Unproven facts should be reported by the auditors to ensure further investigation."
  },
  correctAnswer: "C",
  justification: {
    A: "Auditors are not permitted to divulge propriety information. Such disclosure jeopardizes trust and eventually damages the working relationship between the auditor and auditee.",
    B: "Auditors must avoid discussing the outcomes of previous audit exercises conducted elsewhere except in cases where such internal audit was to assess the efficiency of an internal system that is applicable to more than one facility.",
    C: "If an issue causes a dispute among audit team members, it should be investigated without prejudice to keep the project on course. Objectivity and fairness must be maintained.",
    D: "Unproven facts should not be reported by the auditors."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy.",
  taskId: "T2"
},

{
  id: "D1-102",
  domain: "1 - Information System Auditing Process",
  category: "Types of Audits, Assessments, and Reviews",
  question:
    "After initial investigation, an information systems (IS) auditor has reasons to believe that fraud may be present. The IS auditor should:",
  choices: {
    A: "Expand activities to determine whether an investigation is warranted.",
    B: "Report the matter to the audit committee.",
    C: "Report the possibility of fraud to management.",
    D: "Consult with external legal counsel to determine the course of action to be taken."
  },
  correctAnswer: "A",
  justification: {
    A: "An information systems (IS) auditor’s responsibility for detecting fraud include evaluating fraud indicators and deciding whether any additional action is necessary or whether an investigation should be recommended.",
    B: "The IS auditor should notify the appropriate authorities within the organization only if it has determined that the indicators of fraud are sufficient to recommend an investigation.",
    C: "The IS auditor should report the possibility of fraud to top management only after there is sufficient evidence to launch an investigation.",
    D: "Normally, the IS auditor does not have authority to consult with external legal counsel."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy.",
  taskId: "T2"
},

{
  id: "D1-103",
  domain: "1 - Information System Auditing Process",
  category: "Types of Audits, Assessments, and Reviews",
  question:
    "Which of the following choices is the BEST source of information when developing a risk-based audit plan?",
  choices: {
    A: "Process owners identify key controls.",
    B: "System custodians identify vulnerabilities.",
    C: "Peer auditors understand previous audit results.",
    D: "Senior management identifies key business processes."
  },
  correctAnswer: "D",
  justification: {
    A: "Although process owners should be consulted to identify key controls, senior management is a better source to identify business processes.",
    B: "System custodians are a good source to better understand the risk and controls as they apply to specific applications.",
    C: "The review of previous audit results is one input into the audit planning process.",
    D: "Developing a risk-based audit plan must start with the identification of key business processes."
  },
  taskStatement:
    "Plan an audit to determine whether information systems are protected, controlled, and provide value to the organization.",
  taskId: "T1"
},

{
  id: "D1-104",
  domain: "1 - Information System Auditing Process",
  category: "Types of Audits, Assessments, and Reviews",
  question:
    "Which of the following BEST ensures the effectiveness of controls related to interest calculation for an accounting system?",
  choices: {
    A: "Reperformance",
    B: "Process walk-through",
    C: "Observation",
    D: "Documentation review"
  },
  correctAnswer: "A",
  justification: {
    A: "To ensure the effectiveness of controls, it is most effective to conduct reperformance.",
    B: "Process walk-through may help the auditor understand the controls better.",
    C: "Observation is a valid audit method but reperformance is better.",
    D: "Documentation review may be of some value but reperformance is better."
  },
  taskStatement:
    "Evaluate audit processes as part of quality assurance and improvement programs",
  taskId: "T8"
},

{
  id: "D1-105",
  domain: "1 - Information System Auditing Process",
  category: "Types of Audits, Assessments, and Reviews",
  question:
    "While auditing a third-party IT service provider, an information systems (IS) auditor discovers that access reviews are not being performed as required by the contract. The IS auditor should:",
  choices: {
    A: "Report the issue to IT management.",
    B: "Discuss the issue with the service provider.",
    C: "Perform a risk assessment.",
    D: "Perform an access review."
  },
  correctAnswer: "A",
  justification: {
    A: "During an audit, if there are material issues that are of concern, they need to be reported to management in the audit report.",
    B: "The appropriate response is to report the issue to IT management.",
    C: "This issue can serve as an input for a future risk assessment.",
    D: "The IS auditor should not perform access reviews on behalf of the service provider."
  },
  taskStatement:
    "Evaluate logical, physical, and environmental controls to verify the confidentiality, integrity, and availability of information assets.",
  taskId: "T40"
},

{
  id: "D1-106",
  domain: "1 - Information System Auditing Process",
  category: "Types of Audits, Assessments, and Reviews",
  question:
    "The PRIMARY purpose of the information systems (IS) audit charter is to:",
  choices: {
    A: "Establish the organizational structure of the audit department.",
    B: "Illustrate the reporting responsibilities of the IS audit function.",
    C: "Detail the resource requirements needed for the audit function.",
    D: "Outline the responsibility and authority of the IS audit function."
  },
  correctAnswer: "D",
  justification: {
    A: "The information systems (IS) audit charter does not set forth the organizational structure.",
    B: "The IS audit charter does not dictate the reporting requirements.",
    C: "Resources are determined by the audit and not the charter.",
    D: "The primary purpose of the IS audit charter is to set forth the purpose, responsibility, authority and accountability of the IS audit function."
  },
  taskStatement:
    "Evaluate audit processes as part of quality assurance and improvement programs",
  taskId: "T8"
},

{
  id: "D1-107",
  domain: "1 - Information System Auditing Process",
  category: "Types of Audits, Assessments, and Reviews",
  question:
    "The access control policy should be reviewed by the information systems (IS) auditor to:",
  choices: {
    A: "Prevent unauthorized disclosure of organizational data.",
    B: "Ensure that organizational objectives for separation of duties are met.",
    C: "Minimize the impact of an incident.",
    D: "Ensure the continuity of business after any disaster."
  },
  correctAnswer: "B",
  justification: {
    A: "The principles of confidentiality prevent the unauthorized disclosure of organizational data.",
    B: "The organizational access control policy ensures that organizational objectives for separation of duties are met.",
    C: "The access control policy does not minimize the impact of an incident.",
    D: "The business continuity policy is concerned with the continuity of business."
  },
  taskStatement:
    "Evaluate the organization's management of IT policies and practices, including compliance with legal and regulatory requirements.",
  taskId: "T11"
},

{
  id: "D1-108",
  domain: "1 - Information System Auditing Process",
  category: "Types of Audits, Assessments, and Reviews",
  question:
    "As part of audit planning, an information systems (IS) auditor is designing various data validation tests to effectively detect transposition and transcription errors. Which of the following will BEST help in detecting these errors?",
  choices: {
    A: "Range check",
    B: "Validity check",
    C: "Duplicate check",
    D: "Check digit"
  },
  correctAnswer: "D",
  justification: {
    A: "Range checks cannot detect transposition errors.",
    B: "Validity checks do not detect transposition errors.",
    C: "Duplicate check analysis does not detect transposition errors.",
    D: "The check digit control is effective in detecting transposition and transcription errors."
  },
  taskStatement:
    "Evaluate whether IT vendor selection and contract management processes meet business, legal, and regulatory requirements.",
  taskId: "T19"
},

{
  id: "D1-109",
  domain: "1 - Information System Auditing Process",
  category: "Types of Audits, Assessments, and Reviews",
  question:
    "The PRIMARY purpose for meeting with auditees prior to formally closing a review is to:",
  choices: {
    A: "Confirm that the auditors did not overlook any important issues.",
    B: "Gain agreement on the findings.",
    C: "Receive feedback on the adequacy of the audit procedures.",
    D: "Test the structure of the final presentation."
  },
  correctAnswer: "B",
  justification: {
    A: "The closing meeting does not identify overlooked issues.",
    B: "The primary purpose is to gain agreement on the findings.",
    C: "The meeting is not intended to review audit procedures.",
    D: "The meeting is not intended to test the structure of the presentation."
  },
  taskStatement:
    "Apply project management methodologies to the audit process",
  taskId: "T3"
},

{
  id: "D1-110",
  domain: "1 - Information System Auditing Process",
  category: "Types of Audits, Assessments, and Reviews",
  question:
    "The PRIMARY objective of the audit initiation meeting with an information systems (IS) audit client is to:",
  choices: {
    A: "Discuss the scope of the audit.",
    B: "Identify resource requirements of the audit.",
    C: "Select the methodology of the audit.",
    D: "Collect audit evidence."
  },
  correctAnswer: "A",
  justification: {
    A: "The primary objective of the initiation meeting with an audit client is to help define the scope of the audit.",
    B: "Resource requirements are determined during early planning.",
    C: "Selecting the methodology is not an objective of the initiation meeting.",
    D: "Audit evidence is collected during the engagement."
  },
  taskStatement:
    "Evaluate audit processes as part of quality assurance and improvement programs",
  taskId: "T8"
},
{
  id: "D1-111",
  domain: "1 - Information System Auditing Process",
  category: "Audit Project Management",
  question:
    "While auditing database logs for a client, an information systems (IS) auditor needs to verify their redundant backup on the cloud. Which of the following is the BEST strategy?",
  choices: {
    A: "Inform the cloud service provider about the needed verification and obtain cloud logs.",
    B: "Ignore the backup on the cloud because it is already a verbatim copy.",
    C: "Consider the cloud backup in the next phase of the audit.",
    D: "Inform the client about the suggested modification in the original project plan."
  },
  correctAnswer: "D",
  justification: {
    A: "The cloud service provider needs the client’s authentication.",
    B: "The cloud backup cannot be considered a verbatim copy until verification.",
    C: "Local and remote logs should be compared simultaneously.",
    D: "The audit engagement project plan should be updated and changed as necessary (with appropriate approvals by IT audit and assurance management) during the audit engagement."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-112",
  domain: "1 - Information System Auditing Process",
  category: "Audit Project Management",
  question:
    "The IS auditor’s report should recommend that:",
  choices: {
    A: "The deputy CEO is censured for failure to approve the plan.",
    B: "A group of senior managers is set up to review the existing plan.",
    C: "The existing plan is approved and circulated to all key management and staff.",
    D: "A manager coordinates the creation of a new or revised plan within a defined time limit."
  },
  correctAnswer: "D",
  justification: {
    A: "Censuring the deputy CEO will not improve the current situation and is generally not within the scope of an information systems (IS) auditor to recommend.",
    B: "Establishing a group to review the disaster recovery plan (DRP), which is two years out of date, may achieve an updated DRP but is not likely to be a speedy operation.",
    C: "The current DRP may be unacceptable or ineffective and recommending the approval of the DRP may be unwise.",
    D: "The primary concern is to establish a workable DRP that reflects current processing volumes to protect the organization from any disruptive incident."
  },
  taskStatement:
    "Evaluate IT resource and project management for alignment with the organization's strategies and objectives",
  taskId: "T12"
},

{
  id: "D1-113",
  domain: "1 - Information System Auditing Process",
  category: "Audit Project Management",
  question:
    "Information systems (IS) audit objectives MAINLY focus on:",
  choices: {
    A: "Assuring compliance with business legal and regulatory requirements.",
    B: "Ensuring that information systems (IS) controls exist to minimize business risk to an acceptable level and function as expected.",
    C: "Reviewing the IS general controls’ objectives and whether those controls operate effectively.",
    D: "Determining if there is potential risk to the organization’s IS assets and finding ways to minimize that risk."
  },
  correctAnswer: "B",
  justification: {
    A: "Relevant information systems (IS) controls should be reviewed in terms of their objectives and effectiveness.",
    B: "The main focus of IS audit objectives is to confirm whether IS controls are well-designed and effective to reduce business risk to an acceptable level.",
    C: "IS audit objectives include reviewing different types of IS controls, not only general controls.",
    D: "The main focus of the risk management process is determining potential risk."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-114",
  domain: "1 - Information System Auditing Process",
  category: "Audit Project Management",
  question:
    "The MOST important reason for an information systems (IS) auditor to obtain sufficient and appropriate audit evidence is to:",
  choices: {
    A: "Comply with regulatory requirements.",
    B: "Provide a basis for drawing reasonable conclusions.",
    C: "Ensure complete audit coverage.",
    D: "Perform the audit according to the defined scope."
  },
  correctAnswer: "B",
  justification: {
    A: "Complying with regulatory requirements is relevant to an audit but is not the most important reason.",
    B: "Obtaining sufficient and appropriate evidence assists the auditor in identifying, documenting and validating control weaknesses.",
    C: "Ensuring coverage is relevant but not the most important reason.",
    D: "Performing the audit to meet scope is relevant but not the reason for evidence."
  },
  taskStatement:
    "Plan an audit to determine whether information systems are protected, controlled, and provide value to the organization",
  taskId: "T1"
},

{
  id: "D1-115",
  domain: "1 - Information System Auditing Process",
  category: "Audit Project Management",
  question:
    "What is the MAJOR benefit of conducting a control self-assessment (CSA) over a traditional audit?",
  choices: {
    A: "It detects risk sooner.",
    B: "It replaces the internal audit function.",
    C: "It reduces the audit workload.",
    D: "It reduces audit resource requirements."
  },
  correctAnswer: "A",
  justification: {
    A: "CSAs help to identify risk in a timelier manner because they are conducted more frequently than audits.",
    B: "CSAs do not replace the internal audit function.",
    C: "CSAs may not reduce the audit workload.",
    D: "CSAs do not affect the need for audit resources."
  },
  taskStatement:
    "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
  taskId: "T4"
},

{
  id: "D1-116",
  domain: "1 - Information System Auditing Process",
  category: "Audit Project Management",
  question:
    "During an information systems (IS) audit, which is the BEST method for an IS auditor to evaluate the implementation of separation of duties within an IT department?",
  choices: {
    A: "Discuss with the IT managers.",
    B: "Review the IT job descriptions.",
    C: "Research past IT audit reports.",
    D: "Evaluate the organizational structure."
  },
  correctAnswer: "A",
  justification: {
    A: "Discussing the implementation of separation of duties with the IT managers is the best way to determine how responsibilities are assigned.",
    B: "Job descriptions may be outdated or inaccurate.",
    C: "Past audit reports may not accurately describe current responsibilities.",
    D: "Organizational structure may give only a limited view."
  },
  taskStatement:
    "Apply project management methodologies to the audit process",
  taskId: "T3"
},

{
  id: "D1-117",
  domain: "1 - Information System Auditing Process",
  category: "Audit Project Management",
  question:
    "An information systems (IS) auditor finds that a disaster recovery plan (DRP) for critical business functions does not cover all systems. Which of the following is the MOST appropriate course of action for the IS auditor?",
  choices: {
    A: "Alert management and evaluate the impact of not covering all systems.",
    B: "Cancel the audit.",
    C: "Complete the audit of the systems covered by the existing DRP.",
    D: "Postpone the audit until the systems are added to the DRP."
  },
  correctAnswer: "A",
  justification: {
    A: "The IS auditor should make management aware and evaluate the impact of not including all systems.",
    B: "Canceling the audit is inappropriate.",
    C: "Ignoring uncovered systems violates audit standards.",
    D: "Postponing the audit is inappropriate."
  },
  taskStatement:
    "Evaluate whether IT vendor selection and contract management processes meet business, legal, and regulatory requirements",
  taskId: "T19"
},

{
  id: "D1-118",
  domain: "1 - Information System Auditing Process",
  category: "Audit Project Management",
  question:
    "An information systems (IS) auditor is assigned to review an enterprise’s network; however, the auditor is not comfortable with executing a vulnerability assessment. Which of the following would be the BEST approach for the auditor?",
  choices: {
    A: "Request a change of scope to exclude a vulnerability assessment.",
    B: "Hire independent experts with consent from the authorities.",
    C: "Refuse to conduct the audit due to a competency issue.",
    D: "Proceed to conduct vulnerability assessment with limited skills and lack of needed competencies."
  },
  correctAnswer: "B",
  justification: {
    A: "Reducing scope will impact achievement of audit objectives.",
    B: "Practitioners should seek assistance from independent experts with consent from the authorities.",
    C: "Refusing the audit is not as appropriate as hiring an expert.",
    D: "Conducting an assessment without needed competencies is against professional ethics."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},
{
  id: "D1-119",
  domain: "1 - Information System Auditing Process",
  category: "Audit Testing and Sampling Methodology",
  question:
    "Which of the following forms of evidence does an information systems (IS) auditor consider the MOST reliable?",
  choices: {
    A: "An oral statement from the auditee",
    B: "The results of a test that is performed by an external information systems (IS) auditor",
    C: "An internally generated computer accounting report",
    D: "A confirmation letter that is received from an outside source"
  },
  correctAnswer: "B",
  justification: {
    A: "An oral statement from the auditee is audit evidence but not as reliable as the results of a test that is performed by an external information systems (IS) auditor.",
    B: "An independent test that is performed by an IS auditor should always be considered a more reliable source of evidence than a confirmation letter from a third party.",
    C: "An internally generated computer accounting report is audit evidence but is not as reliable as the results of a test performed by an external IS auditor.",
    D: "An independent test performed by an IS auditor should always be considered a more reliable source of evidence than a confirmation letter from a third party."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-120",
  domain: "1 - Information System Auditing Process",
  category: "Audit Testing and Sampling Methodology",
  question:
    "When evaluating the controls of an electronic data interchange (EDI) application, an information systems (IS) auditor should PRIMARILY be concerned with the risk of:",
  choices: {
    A: "Excessive transaction turnaround time.",
    B: "Application interface failure.",
    C: "Improper transaction authorization.",
    D: "Non-validated batch totals."
  },
  correctAnswer: "C",
  justification: {
    A: "An excessive turnaround time is an inconvenience, but not a serious risk.",
    B: "The failure of the application interface is a risk, but not the most serious issue.",
    C: "Foremost among the risk associated with electronic data interchange (EDI) is improper transaction authorization.",
    D: "The integrity of EDI transactions is important, but not as significant as the risk of unauthorized transactions."
  },
  taskStatement:
    "Plan an audit to determine whether information systems are protected, controlled, and provide value to the organization",
  taskId: "T1"
},

{
  id: "D1-121",
  domain: "1 - Information System Auditing Process",
  category: "Audit Testing and Sampling Methodology",
  question:
    "An information systems (IS) auditor is reviewing a monthly accounts payable transaction register using audit software. Why would the auditor be interested in using a check digit?",
  choices: {
    A: "To detect data transposition errors",
    B: "To ensure that transactions do not exceed predetermined amounts",
    C: "To ensure that data entered are within reasonable limits",
    D: "To ensure that data entered are within a predetermined range of values"
  },
  correctAnswer: "A",
  justification: {
    A: "A check digit is a numeric value added to data to ensure that original data are correct and have not been altered.",
    B: "Ensuring that data have not exceeded a predetermined amount is a limit check.",
    C: "Ensuring that data entered are within predetermined reasonable limits is a reasonableness check.",
    D: "Ensuring that data entered are within a predetermined range of values is a range check."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-122",
  domain: "1 - Information System Auditing Process",
  category: "Audit Testing and Sampling Methodology",
  question:
    "An information systems (IS) auditor is planning to evaluate the control design effectiveness that is related to an automated billing process. Which of the following is the MOST effective approach for the auditor to adopt?",
  choices: {
    A: "Interview",
    B: "Inquiry",
    C: "Reperformance",
    D: "Walk-through"
  },
  correctAnswer: "D",
  justification: {
    A: "An interview is not as strong evidence as an observation or walk-throughs.",
    B: "Inquiry can be used to understand the controls only if it is accompanied by verification of evidence.",
    C: "Reperformance is used to evaluate the operating effectiveness of the control rather than the design.",
    D: "Walk-throughs involve a combination of inquiry and inspection of evidence and confirm that the control exists."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-123",
  domain: "1 - Information System Auditing Process",
  category: "Audit Testing and Sampling Methodology",
  question:
    "After identifying the findings, the information systems (IS) auditor should FIRST:",
  choices: {
    A: "Gain agreement on the findings.",
    B: "Determine mitigation measures for the findings.",
    C: "Inform senior management of the findings.",
    D: "Obtain remediation deadlines to close the findings."
  },
  correctAnswer: "A",
  justification: {
    A: "When an agreement is obtained with the auditee, it implies that the finding is understood and a clear plan of action can be determined.",
    B: "The organization ultimately decides and implements mitigation strategies.",
    C: "Agreement with the auditee should be obtained before informing senior management.",
    D: "Obtaining remediation deadlines is not the first step."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-124",
  domain: "1 - Information System Auditing Process",
  category: "Audit Testing and Sampling Methodology",
  question:
    "An information systems (IS) auditor identifies a business process to be audited. The IS auditor should NEXT identify the:",
  choices: {
    A: "Most valuable information assets.",
    B: "IS audit resources to be deployed.",
    C: "Auditee personnel to be interviewed.",
    D: "Control objectives and activities."
  },
  correctAnswer: "D",
  justification: {
    A: "To determine the key information assets, the IS auditor should first determine which control objectives and activities should be validated.",
    B: "Audit resources can be determined only after controls are identified.",
    C: "Personnel identification follows identification of control activities.",
    D: "After the business process is identified, the IS auditor should first identify the control objectives and activities."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-125",
  domain: "1 - Information System Auditing Process",
  category: "Audit Testing and Sampling Methodology",
  question:
    "Which of the following is MOST important to ensure that effective application controls are maintained?",
  choices: {
    A: "Exception reporting",
    B: "Manager oversight",
    C: "Control self-assessment (CSA)",
    D: "Peer reviews"
  },
  correctAnswer: "C",
  justification: {
    A: "Exception reporting does not ensure that controls are still working.",
    B: "Manager oversight may not be consistent or well-defined.",
    C: "Control self-assessment (CSA) includes testing the design of automated application controls.",
    D: "Peer reviews lack direct involvement of audit specialists and management."
  },
  taskStatement:
    "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
  taskId: "T4"
},

{
  id: "D1-126",
  domain: "1 - Information System Auditing Process",
  category: "Audit Testing and Sampling Methodology",
  question:
    "Which of the following is an attribute of the control self-assessment (CSA) approach?",
  choices: {
    A: "Broad stakeholder involvement",
    B: "Auditors are the primary control analysts",
    C: "Limited employee participation",
    D: "Policy-driven"
  },
  correctAnswer: "A",
  justification: {
    A: "The attributes of CSA include empowered employees, continuous improvement and extensive employee participation.",
    B: "Auditors are primary analysts in a traditional audit approach.",
    C: "Limited participation is an attribute of a traditional audit approach.",
    D: "Policy-driven is an attribute of a traditional audit approach."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-127",
  domain: "1 - Information System Auditing Process",
  category: "Audit Testing and Sampling Methodology",
  question:
    "An information systems (IS) auditor wants to determine the effectiveness of managing user access to a server room. Which of the following is the BEST evidence of effectiveness?",
  choices: {
    A: "Observation of a logged event",
    B: "Review of the procedure manual",
    C: "Interview with management",
    D: "Interview with security personnel"
  },
  correctAnswer: "A",
  justification: {
    A: "Observation and logging provide the best evidence of the adequacy of the physical security control.",
    B: "A procedure manual is not evidence of execution.",
    C: "Interviews are not evidence of execution.",
    D: "Interviews are not evidence of execution."
  },
  taskStatement:
    "Plan an audit to determine whether information systems are protected, controlled, and provide value to the organization",
  taskId: "T1"
},

{
  id: "D1-128",
  domain: "1 - Information System Auditing Process",
  category: "Audit Testing and Sampling Methodology",
  question:
    "An external information systems (IS) auditor discovers that systems in the scope of the audit were implemented by an associate. In such a circumstance, IS audit management should:",
  choices: {
    A: "Remove the IS auditor from the engagement.",
    B: "Cancel the engagement.",
    C: "Disclose the issue to the client.",
    D: "Take steps to restore the IS auditor’s independence."
  },
  correctAnswer: "C",
  justification: {
    A: "Withdrawal is not necessary unless required by statute.",
    B: "Canceling the engagement is not required if properly disclosed.",
    C: "The facts surrounding the issue of independence should be disclosed to management and in the report.",
    D: "Independence cannot be restored while continuing the audit."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-129",
  domain: "1 - Information System Auditing Process",
  category: "Audit Testing and Sampling Methodology",
  question:
    "Which of the following would MOST likely help an enterprise determine its scope related to the selection and implementation of information systems (IS) security standards?",
  choices: {
    A: "Select a standard that most closely covers the regulatory requirements of the enterprise.",
    B: "Remove the clauses of the selected standard that are not relevant to the enterprise.",
    C: "Change the clauses of the selected standard that are relevant to the enterprise.",
    D: "Determine the internal penalties of noncompliance with the selected standard."
  },
  correctAnswer: "B",
  justification: {
    A: "Regulatory compliance is important but not the only requirement.",
    B: "The enterprise should choose only the relevant portions of the standards.",
    C: "Changing clauses may eliminate mandatory requirements.",
    D: "Internal penalties do not help determine scope."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-130",
  domain: "1 - Information System Auditing Process",
  category: "Audit Testing and Sampling Methodology",
  question:
    "An information systems (IS) auditor finds a small number of user access requests that were not authorized by managers through the normal predefined workflow steps and escalation rules. The IS auditor should:",
  choices: {
    A: "Perform an additional analysis.",
    B: "Report the problem to the audit committee.",
    C: "Conduct a security risk assessment.",
    D: "Recommend that the owner of the identity management system fix the workflow issues."
  },
  correctAnswer: "A",
  justification: {
    A: "The IS auditor needs to perform substantive testing and additional analysis to determine the root cause.",
    B: "There is not enough information to report the problem.",
    C: "A security risk assessment requires more information.",
    D: "The IS auditor must first determine the root cause."
  },
  taskStatement:
    "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
  taskId: "T4"
},

{
  id: "D1-131",
  domain: "1 - Information System Auditing Process",
  category: "Audit Testing and Sampling Methodology",
  question:
    "In the process of evaluating program change controls, an information systems (IS) auditor uses source code comparison software to:",
  choices: {
    A: "Examine source program changes without information from IS personnel.",
    B: "Detect a source program change made between acquiring a copy of the source and the comparison run.",
    C: "Confirm that the control copy is the current version of the production program.",
    D: "Ensure that all changes made in the current source copy are tested."
  },
  correctAnswer: "A",
  justification: {
    A: "Source code comparison provides objective and independent assurance of program changes.",
    B: "It compares two versions but does not detect changes since acquisition.",
    C: "This is a library management function.",
    D: "Comparison does not ensure testing."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-132",
  domain: "1 - Information System Auditing Process",
  category: "Audit Testing and Sampling Methodology",
  question:
    "An information systems (IS) auditor is reviewing access to an application to determine whether recently added accounts were appropriately authorized. This is an example of:",
  choices: {
    A: "Variable sampling.",
    B: "Substantive testing.",
    C: "Compliance testing.",
    D: "Stop-or-go sampling."
  },
  correctAnswer: "C",
  justification: {
    A: "Variable sampling estimates numerical values.",
    B: "Substantive testing substantiates integrity of actual processing.",
    C: "Compliance testing determines whether controls are being applied in compliance with policy.",
    D: "Stop-or-go sampling is not appropriate here."
  },
  taskStatement:
    "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
  taskId: "T4"
},

{
  id: "D1-133",
  domain: "1 - Information System Auditing Process",
  category: "Audit Testing and Sampling Methodology",
  question:
    "Which of the following impairs the independence of a quality assurance (QA) team?",
  choices: {
    A: "Ensuring compliance with development methods",
    B: "Checking the test assumptions",
    C: "Correcting coding errors during the testing process",
    D: "Checking the code to ensure proper documentation"
  },
  correctAnswer: "C",
  justification: {
    A: "This is a valid QA function.",
    B: "This is a valid QA function.",
    C: "Correction of code impairs independence and separation of duties.",
    D: "This is a valid QA function."
  },
  taskStatement:
    "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
  taskId: "T4"
},

{
  id: "D1-134",
  domain: "1 - Information System Auditing Process",
  category: "Audit Testing and Sampling Methodology",
  question:
    "An information systems (IS) auditor wants to determine the number of purchase orders that are not appropriately approved. Which of the following sampling techniques should an IS auditor use to make such a conclusion?",
  choices: {
    A: "Attribute",
    B: "Variable",
    C: "Stop-or-go",
    D: "Judgment"
  },
  correctAnswer: "A",
  justification: {
    A: "Attribute sampling is used to test compliance of transactions to controls.",
    B: "Variable sampling is used in substantive testing.",
    C: "Stop-or-go sampling is used when expected occurrence is extremely low.",
    D: "Judgment sampling is subjective."
  },
  taskStatement:
    "Utilize data analytics tools to enhance audit processes",
  taskId: "T6"
},

{
  id: "D1-135",
  domain: "1 - Information System Auditing Process",
  category: "Audit Testing and Sampling Methodology",
  question:
    "While evaluating software development practices in an organization, an information systems (IS) auditor notes that the quality assurance (QA) function reports to project management. The MOST important concern for an IS auditor is the:",
  choices: {
    A: "Effectiveness of the QA function because it should interact between project management and user management.",
    B: "Efficiency of the QA function because it should interact with the project implementation team.",
    C: "Effectiveness of the project manager because the project manager should interact with the QA function.",
    D: "Efficiency of the project manager because the QA function needs to communicate with the project implementation team."
  },
  correctAnswer: "A",
  justification: {
    A: "QA should be independent of project management to avoid pressure.",
    B: "Efficiency is not the primary concern.",
    C: "This does not affect project manager effectiveness.",
    D: "QA interaction does not impact project manager efficiency."
  },
  taskStatement:
    "Plan an audit to determine whether information systems are protected, controlled, and provide value to the organization",
  taskId: "T1"
},

{
  id: "D1-136",
  domain: "1 - Information System Auditing Process",
  category: "Audit Testing and Sampling Methodology",
  question:
    "To ensure that audit resources deliver the best value to the organization, the FIRST step in an audit project is to:",
  choices: {
    A: "Schedule the audits and monitor the time spent on each audit.",
    B: "Train the information systems (IS) audit staff on current technology used in the organization.",
    C: "Develop the audit plan based on a detailed risk assessment.",
    D: "Monitor progress of audits and initiate cost control measures."
  },
  correctAnswer: "C",
  justification: {
    A: "Monitoring is ineffective if wrong areas are audited.",
    B: "Training is not the first step.",
    C: "Developing a risk-based audit plan ensures effective use of resources.",
    D: "Cost control does not ensure effective use of resources."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},

{
  id: "D1-137",
  domain: "1 - Information System Auditing Process",
  category: "Audit Testing and Sampling Methodology",
  question:
    "While reviewing sensitive electronic work papers, the information systems (IS) auditor notices that they were not encrypted. This could compromise the:",
  choices: {
    A: "Audit trail of the versioning of the work papers.",
    B: "Approval of the audit phases.",
    C: "Access rights to the work papers.",
    D: "Confidentiality of the work papers."
  },
  correctAnswer: "D",
  justification: {
    A: "Audit trails do not affect confidentiality.",
    B: "Approvals do not affect confidentiality.",
    C: "Lack of encryption breaches confidentiality, not access rights.",
    D: "Encryption provides confidentiality for electronic work papers."
  },
  taskStatement:
    "Utilize data analytics tools to enhance audit processes",
  taskId: "T6"
},

{
  id: "D1-138",
  domain: "1 - Information System Auditing Process",
  category: "Audit Testing and Sampling Methodology",
  question:
    "An audit charter should:",
  choices: {
    A: "Be dynamic and change to coincide with the changing nature of technology and the audit profession.",
    B: "Clearly state the audit objectives and delegation of authority for the maintenance and review of internal controls.",
    C: "Document the audit procedures designed to achieve the planned audit objectives.",
    D: "Outline the overall authority, scope and responsibilities of the audit function."
  },
  correctAnswer: "D",
  justification: {
    A: "The audit charter should not significantly change over time.",
    B: "The charter does not include maintenance of controls.",
    C: "The charter does not document procedures.",
    D: "The audit charter outlines authority, scope and responsibilities."
  },
  taskStatement:
    "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
  taskId: "T4"
},

{
  id: "D1-139",
  domain: "1 - Information System Auditing Process",
  category: "Audit Testing and Sampling Methodology",
  question:
    "While planning an information systems (IS) audit, an assessment of risk should be made to provide:",
  choices: {
    A: "Reasonable assurance that the audit will cover material items.",
    B: "Definite assurance that material items will be covered during the audit work.",
    C: "Reasonable assurance that all items will be covered by the audit.",
    D: "Sufficient assurance that all items will be covered during the audit work."
  },
  correctAnswer: "A",
  justification: {
    A: "Risk assessment supports prioritization to ensure material items are covered.",
    B: "Definite assurance is impractical.",
    C: "Audits focus on material items, not all items.",
    D: "Covering all items is not required."
  },
  taskStatement:
    "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
  taskId: "T4"
},
{
  id: "D1-140",
  domain: "1 - Information System Auditing Process",
  category: "Audit Evidence Collection Techniques",
  question:
    "When evaluating the collective effect of preventive, detective and corrective controls within a process, an information systems (IS) auditor should be aware of which of the following?",
  choices: {
    A: "The point at which controls are exercised as data flow through the system.",
    B: "Only preventive and detective controls are relevant.",
    C: "Corrective controls are regarded as compensating.",
    D: "Classification allows an IS auditor to determine the controls that are missing."
  },
  correctAnswer: "A",
  justification: {
    A: "An information systems (IS) auditor should focus on when controls are exercised as data flow through a computer system.",
    B: "Corrective controls may also be relevant because they allow an error or problem to be corrected.",
    C: "Corrective controls remove or reduce the effects of errors or irregularities and are not exclusively regarded as compensating controls.",
    D: "The existence and function of controls are important but not the classification."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},
{
  id: "D1-141",
  domain: "1 - Information System Auditing Process",
  category: "Audit Evidence Collection Techniques",
  question:
    "An information systems (IS) auditor wants to analyze audit trails on critical servers to discover potential anomalies in user or system behavior. Which of the following is the MOST suitable for performing that task?",
  choices: {
    A: "Computer-aided software engineering tools",
    B: "Embedded data collection tools",
    C: "Trend/variance detection tools",
    D: "Heuristic scanning tools"
  },
  correctAnswer: "C",
  justification: {
    A: "Computer-aided software engineering tools are used to assist in software development.",
    B: "Embedded (audit) data collection software, such as systems control audit review file or systems audit review file, is used to provide sampling and production statistics, but not to conduct an audit log analysis.",
    C: "Trend/variance detection tools look for anomalies in user or system behavior, such as invoices with increasing invoice numbers.",
    D: "Heuristic scanning tools are a type of virus scanning used to indicate possible infected traffic."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},
{
  id: "D1-142",
  domain: "1 - Information System Auditing Process",
  category: "Audit Evidence Collection Techniques",
  question:
    "An information systems (IS) auditor reviews one day of logs for a remotely managed server and finds one case where logging failed, and the backup restarts cannot be confirmed. What should the IS auditor do?",
  choices: {
    A: "Issue an audit finding.",
    B: "Seek an explanation from IS management.",
    C: "Review the classifications of data held on the server.",
    D: "Expand the sample of logs reviewed."
  },
  correctAnswer: "D",
  justification: {
    A: "At this stage, it is too preliminary to issue an audit finding. Seeking an explanation from management is advisable, but it is better to gather additional evidence to properly evaluate the seriousness of the situation.",
    B: "Without gathering more information on the incident and the frequency of the incident, it is difficult to obtain a meaningful explanation from management.",
    C: "A backup failure, which has not been established at this point, is serious if it involves critical data. However, the issue is not the importance of the data on the server, where a problem has been detected, but whether a systematic control failure that impacts other servers exists.",
    D: "IS Audit and Assurance Standards require that an IS auditor gather sufficient and appropriate audit evidence. The IS auditor found a potential problem and now needs to determine whether this is an isolated incident or a systematic control failure."
  },
  taskStatement:
    "Utilize data analytics tools to enhance audit processes",
  taskId: "T6"
},
{
  id: "D1-143",
  domain: "1 - Information System Auditing Process",
  category: "Audit Evidence Collection Techniques",
  question:
    "An organization uses a bank to process its weekly payroll. Time sheets and payroll adjustment forms (e.g., hourly rate changes and terminations) are completed and delivered to the bank, which prepares the checks and reports for distribution. To BEST ensure payroll data accuracy:",
  choices: {
    A: "Payroll reports should be compared to input forms.",
    B: "Gross payroll should be recalculated manually.",
    C: "Checks should be compared to input forms.",
    D: "Checks should be reconciled with output reports."
  },
  correctAnswer: "A",
  justification: {
    A: "The best way to confirm data accuracy, when input is provided by the organization and output is generated by the bank, is to verify the data input (input forms) with the results of the payroll reports.",
    B: "Recalculating gross payroll manually only verifies whether the processing is correct and not the data accuracy of inputs.",
    C: "Comparing checks to input forms is not feasible because checks contain the processed information and input forms contain the input data.",
    D: "Reconciling checks with output reports only confirms that checks were issued as stated on output reports."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},
{
  id: "D1-144",
  domain: "1 - Information System Auditing Process",
  category: "Audit Evidence Collection Techniques",
  question:
    "During an audit, the information systems (IS) auditor notes that the application developer also performs quality assurance testing on another application. Which of the following is the MOST important course of action for the auditor?",
  choices: {
    A: "Recommend compensating controls.",
    B: "Review the code created by the developer.",
    C: "Analyze the quality assurance dashboards.",
    D: "Report the identified condition."
  },
  correctAnswer: "D",
  justification: {
    A: "Although compensating controls may be a good idea, the primary response in this case should be to report the condition, because the risk associated with this should be reported to the users of the audit report.",
    B: "Evaluating the code created by the application developer is not the appropriate response in this case. The information systems (IS) auditor may evaluate a sample of changes to determine whether the developer tested his/her own code, but the primary response should be to report the condition.",
    C: "Analyzing the quality assurance dashboards can help evaluate the actual impact of the lack of separation of duties but does not address the underlying risk. The primary response should be to report the condition.",
    D: "The software quality assurance role should be independent from development and development activities. The same person should not hold both roles, because this causes a separation of duties concern. The IS auditor should report this condition when identified."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},
{
  id: "D1-145",
  domain: "1 - Information System Auditing Process",
  category: "Audit Evidence Collection Techniques",
  question:
    "An internal information systems (IS) audit function is planning a general IS audit. Which of the following activities takes place during the FIRST step of the planning phase?",
  choices: {
    A: "Developing an audit program",
    B: "Defining the audit scope",
    C: "Identifying key information owners",
    D: "Developing a risk assessment"
  },
  correctAnswer: "D",
  justification: {
    A: "The results of the risk assessment are used for the input for the audit program.",
    B: "The output of the risk assessment helps define the scope.",
    C: "A risk assessment must be performed prior to identifying key information owners. Key information owners are generally not directly involved during the planning process of an audit.",
    D: "A risk assessment should be performed to determine how internal audit resources should be allocated to ensure that all material items will be addressed."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},
{
  id: "D1-146",
  domain: "1 - Information System Auditing Process",
  category: "Audit Evidence Collection Techniques",
  question:
    "An information systems (IS) auditor is conducting a compliance test to determine whether controls support management policies and procedures. The test will assist the IS auditor to determine:",
  choices: {
    A: "That the control is operating efficiently.",
    B: "That the control is operating as designed.",
    C: "The integrity of data controls.",
    D: "The reasonableness of financial reporting controls."
  },
  correctAnswer: "B",
  justification: {
    A: "It is important that controls operate efficiently, but, in this case, the intent is to ensure that the controls support management policies and procedures.",
    B: "Compliance tests can be used to test the existence and effectiveness of a defined process.",
    C: "Substantive tests, not compliance tests, are associated with data integrity.",
    D: "Determining the reasonableness of financial reporting controls is limited to financial reporting and does not ensure controls are working correctly."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},
{
  id: "D1-147",
  domain: "1 - Information System Auditing Process",
  category: "Audit Evidence Collection Techniques",
  question:
    "A PRIMARY benefit derived for an organization employing control self-assessment (CSA) techniques is that it:",
  choices: {
    A: "Can identify high-risk areas that might need a detailed review later.",
    B: "Allows information systems (IS) auditors to independently assess risk.",
    C: "Can be used as a replacement for traditional audits.",
    D: "Allows management to relinquish responsibility for control."
  },
  correctAnswer: "A",
  justification: {
    A: "Control self-assessment (CSA) is predicated on the review of high-risk areas that either need immediate attention or may require a more thorough review later.",
    B: "CSA requires the involvement of information systems (IS) auditors and line management.",
    C: "CSA is not a replacement for traditional audits.",
    D: "CSA does not allow management to relinquish its responsibility for control."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},
{
  id: "D1-148",
  domain: "1 - Information System Auditing Process",
  category: "Audit Evidence Collection Techniques",
  question:
    "During a security audit of IT processes, an information systems (IS) auditor finds that documented security procedures do not exist. The IS auditor should:",
  choices: {
    A: "Create the procedures document based on the practices.",
    B: "Issue an opinion of the current state and end the audit.",
    C: "Conduct compliance testing on available data.",
    D: "Identify and evaluate existing practices."
  },
  correctAnswer: "D",
  justification: {
    A: "Information systems (IS) auditors should not prepare documentation.",
    B: "Ending the audit does not address identification of potential risk.",
    C: "Without documented procedures, there is no basis for compliance testing.",
    D: "One of the main objectives of an audit is to identify potential risk by evaluating existing practices."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},
{
  id: "D1-149",
  domain: "1 - Information System Auditing Process",
  category: "Audit Evidence Collection Techniques",
  question:
    "When performing a risk analysis, the information systems (IS) auditor should FIRST:",
  choices: {
    A: "Review the data classification program.",
    B: "Identify the organization’s information assets.",
    C: "Identify the inherent risk of the system.",
    D: "Perform a cost-benefit analysis for controls."
  },
  correctAnswer: "B",
  justification: {
    A: "The data classification program assists after assets are identified.",
    B: "The first step of the risk assessment process is to identify the systems and processes that support the business objectives.",
    C: "Inherent risk assessment requires understanding the systems and assets first.",
    D: "Cost-benefit analysis can only be performed after risks are identified."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},
{
  id: "D1-150",
  domain: "1 - Information System Auditing Process",
  category: "Audit Evidence Collection Techniques",
  question:
    "The MOST appropriate action for an information systems (IS) auditor to take when shared user accounts are discovered is to:",
  choices: {
    A: "Inform the audit committee of the potential issue.",
    B: "Review audit logs for the IDs in question.",
    C: "Document the finding and explain the risk of using shared IDs.",
    D: "Request that the IDs be removed from the system."
  },
  correctAnswer: "C",
  justification: {
    A: "Findings should first be presented to management.",
    B: "Shared IDs do not provide individual accountability.",
    C: "The IS auditor should document the finding and explain the risk.",
    D: "It is not the auditor’s role to request removal of IDs."
  },
  taskStatement:
    "Utilize data analytics tools to enhance audit processes",
  taskId: "T6"
},
{
  id: "D1-151",
  domain: "1 - Information System Auditing Process",
  category: "Audit Evidence Collection Techniques",
  question:
    "Which of the following represents the GREATEST potential risk in an electronic data interchange (EDI) environment?",
  choices: {
    A: "Lack of transaction authorizations",
    B: "Loss or duplication of EDI transmissions",
    C: "Transmission delay",
    D: "Deletion or manipulation of transactions prior to, or after, establishment of application controls"
  },
  correctAnswer: "A",
  justification: {
    A: "Lack of transaction authorization poses the greatest risk due to absence of inherent authentication.",
    B: "Transactions should be logged, reducing impact.",
    C: "Delays do not result in data loss.",
    D: "Logging reduces impact compared to unauthorized transactions."
  },
  taskStatement:
    "Utilize data analytics tools to enhance audit processes",
  taskId: "T6"
},
{
  id: "D1-152",
  domain: "1 - Information System Auditing Process",
  category: "Audit Evidence Collection Techniques",
  question:
    "When developing a risk management program, what is the FIRST activity to be performed?",
  choices: {
    A: "Threat assessment",
    B: "Classification of data",
    C: "Inventory of assets",
    D: "Criticality analysis"
  },
  correctAnswer: "C",
  justification: {
    A: "Threats are assessed after assets are identified.",
    B: "Data classification occurs after assets are identified.",
    C: "Identification of assets is the first step.",
    D: "Criticality analysis follows asset identification."
  },
  taskStatement:
    "Plan an audit to determine whether information systems are protected, controlled, and provide value to the organization",
  taskId: "T1"
},
{
  id: "D1-153",
  domain: "1 - Information System Auditing Process",
  category: "Audit Evidence Collection Techniques",
  question:
    "Which of the following is in the BEST position to approve changes to the audit charter?",
  choices: {
    A: "Board of directors",
    B: "Audit committee",
    C: "Executive management",
    D: "Director of internal audit"
  },
  correctAnswer: "B",
  justification: {
    A: "Approval is delegated to the audit committee.",
    B: "The audit committee should approve the audit charter.",
    C: "Executive management lacks independence.",
    D: "The director may draft but not approve."
  },
  taskStatement:
    "Evaluate logical, physical, and environmental controls to verify the confidentiality, integrity, and availability of information assets",
  taskId: "T40"
},
{
  id: "D1-154",
  domain: "1 - Information System Auditing Process",
  category: "Audit Evidence Collection Techniques",
  question:
    "An information systems (IS) auditor finds that the answers received during an interview with a payroll clerk do not support job descriptions and documented procedures. Under these circumstances, the IS auditor should:",
  choices: {
    A: "Conclude that the controls are inadequate.",
    B: "Expand the scope to include substantive testing.",
    C: "Place greater reliance on previous audits.",
    D: "Suspend the audit."
  },
  correctAnswer: "B",
  justification: {
    A: "Interviews alone are insufficient evidence.",
    B: "Additional substantive testing is required.",
    C: "Previous audits do not reflect current conditions.",
    D: "Suspending the audit is inappropriate."
  },
  taskStatement:
    "Plan an audit to determine whether information systems are protected, controlled, and provide value to the organization",
  taskId: "T1"
},
{
  id: "D1-155",
  domain: "1 - Information System Auditing Process",
  category: "Audit Evidence Collection Techniques",
  question:
    "An information systems (IS) auditor notes that failed login attempts to a core financial system are automatically logged and the logs are retained for a year by the organization. This logging is:",
  choices: {
    A: "An effective preventive control.",
    B: "A valid detective control.",
    C: "Not an adequate control.",
    D: "A corrective control."
  },
  correctAnswer: "C",
  justification: {
    A: "Logging does not prevent access.",
    B: "Logs must be reviewed to be detective.",
    C: "Logging alone is not a control.",
    D: "Logging does not correct issues."
  },
  taskStatement:
    "Plan an audit to determine whether information systems are protected, controlled, and provide value to the organization",
  taskId: "T1"
},
{
  id: "D1-156",
  domain: "1 - Information System Auditing Process",
  category: "Audit Evidence Collection Techniques",
  question:
    "When selecting audit procedures, an information systems (IS) auditor should use professional judgment to ensure that:",
  choices: {
    A: "Sufficient evidence will be collected.",
    B: "Significant deficiencies will be corrected within a reasonable period.",
    C: "All material weaknesses will be identified.",
    D: "Audit costs will be kept at a minimum level."
  },
  correctAnswer: "A",
  justification: {
    A: "Professional judgment is used to assess sufficiency of evidence.",
    B: "Correction is management’s responsibility.",
    C: "No audit can guarantee all weaknesses are identified.",
    D: "Cost minimization is secondary."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},
{
  id: "D1-157",
  domain: "1 - Information System Auditing Process",
  category: "Audit Evidence Collection Techniques",
  question:
    "Corrective action has been taken by an auditee immediately after the identification of a reportable finding. The information systems (IS) auditor should:",
  choices: {
    A: "Include the finding in the final report because the IS auditor is responsible for an accurate report of all findings.",
    B: "Not include the finding in the final report because management resolved the item.",
    C: "Not include the finding in the final report because corrective action can be verified by the IS auditor during the audit.",
    D: "Include the finding in the closing meeting for discussion purposes only."
  },
  correctAnswer: "A",
  justification: {
    A: "Findings and corrective actions must be reported.",
    B: "Resolution does not remove reporting requirement.",
    C: "Verification does not negate reporting.",
    D: "Findings must be in the final report."
  },
  taskStatement:
    "Plan an audit to determine whether information systems are protected, controlled, and provide value to the organization",
  taskId: "T1"
},
{
  id: "D1-158",
  domain: "1 - Information System Auditing Process",
  category: "Audit Evidence Collection Techniques",
  question:
    "When preparing an audit report, the information systems (IS) auditor should ensure that the results are supported by:",
  choices: {
    A: "Statements from IS management.",
    B: "Work papers of other auditors.",
    C: "An organizational control self-assessment.",
    D: "Sufficient and appropriate audit evidence."
  },
  correctAnswer: "D",
  justification: {
    A: "Statements alone are insufficient.",
    B: "Other auditors’ work cannot stand alone.",
    C: "CSA alone is insufficient.",
    D: "Reports must be supported by sufficient and appropriate evidence."
  },
  taskStatement:
    "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
  taskId: "T2"
},
{
  id: "D1-159",
  domain: "1 - Information System Auditing Process",
  category: "Audit Evidence Collection Techniques",
  question:
    "In planning an information systems (IS) audit, the MOST critical step is the identification of the:",
  choices: {
    A: "Areas of significant risk.",
    B: "Skill sets of the audit staff.",
    C: "Test steps in the audit.",
    D: "Time allotted for the audit."
  },
  correctAnswer: "A",
  justification: {
    A: "Risk identification drives audit planning.",
    B: "Skills are addressed after scope is defined.",
    C: "Test steps follow risk identification.",
    D: "Time allocation depends on risk."
  },
  taskStatement:
    "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
  taskId: "T4"
},

{
  id: "D1-160",
  domain: "1 - Information System Auditing Process",
  category: "Reporting and Communication Techniques",
  question: "During an application software review, an information systems (IS) auditor identified minor weaknesses in a relevant database environment that is out of scope for the audit. The BEST option is to:",
  choices: {
    A: "Include a review of the database controls in the scope.",
    B: "Document for future review.",
    C: "Work with database administrators to correct the issue.",
    D: "Report the weaknesses as observed."
    },
  correctAnswer: "D",
  justification: {
      A: "Executing audits and reviews outside the scope is not advisable.",
      B: "Weaknesses should be formally reported rather than deferred.",
      C: "It is not appropriate for the IS auditor to correct issues.",
      D: "Any weakness noticed should be reported, even if it is outside scope."
    },
    taskStatement: "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
    taskId: "T4"
  },
  {
    id: "D1-161",
    domain: "1 - Information System Auditing Process",
    category: "Reporting and Communication Techniques",
    question: "An information systems (IS) auditor is comparing equipment in production with inventory records. This type of testing is an example of:",
    choices: {
      A: "Substantive testing.",
      B: "Compliance testing.",
      C: "Analytical testing.",
      D: "Control testing."
    },
    correctAnswer: "A",
    justification: {
      A: "Substantive testing verifies completeness, accuracy, or existence.",
      B: "Compliance testing evaluates adherence to controls.",
      C: "Analytical testing evaluates relationships between data sets.",
      D: "Control testing is equivalent to compliance testing."
    },
    taskStatement: "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
    taskId: "T4"
  },
  {
    id: "D1-162",
    domain: "1 - Information System Auditing Process",
    category: "Reporting and Communication Techniques",
    question: "An appropriate control for ensuring the authenticity of orders received in an electronic data interchange system application is to:",
    choices: {
      A: "Acknowledge receipt of electronic orders with a confirmation message.",
      B: "Perform reasonableness checks on quantities ordered before filling orders.",
      C: "Verify the identity of senders and determine if orders correspond to contract terms.",
      D: "Encrypt electronic orders."
    },
    correctAnswer: "C",
    justification: {
      A: "Acknowledgment does not authenticate orders.",
      B: "Reasonableness checks ensure correctness, not authenticity.",
      C: "Authentication of users and messages is required.",
      D: "Encryption does not prove authenticity."
    },
    taskStatement: "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
    taskId: "T4"
  },
  {
    id: "D1-163",
    domain: "1 - Information System Auditing Process",
    category: "Reporting and Communication Techniques",
    question: "During the planning stage of an information systems (IS) audit, the PRIMARY goal of an IS auditor is to:",
    choices: {
      A: "Address audit objectives.",
      B: "Collect sufficient evidence.",
      C: "Specify appropriate tests.",
      D: "Minimize audit resources."
    },
    correctAnswer: "A",
    justification: {
      A: "Planning must address audit objectives.",
      B: "Evidence is collected during execution.",
      C: "Tests are secondary to objectives.",
      D: "Resource minimization is not the primary goal."
    },
    taskStatement: "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
    taskId: "T4"
  },
  {
    id: "D1-164",
    domain: "1 - Information System Auditing Process",
    category: "Reporting and Communication Techniques",
    question: "An information systems (IS) auditor who was involved in designing an organization’s business continuity plan (BCP) has been assigned to audit the plan. The IS auditor should:",
    choices: {
      A: "Decline the assignment.",
      B: "Inform management of the conflict after completing the audit.",
      C: "Inform the BCP team prior to beginning the assignment.",
      D: "Confirm the possibility of conflict of interest to audit management prior to starting the assignment."
    },
    correctAnswer: "D",
    justification: {
      A: "Declining requires approval and disclosure.",
      B: "Disclosure must occur before starting.",
      C: "The BCP team does not have authority.",
      D: "Conflicts must be disclosed to audit management in advance."
    },
    taskStatement: "Conduct post-audit follow up to evaluate whether identified risk has been sufficiently addressed",
    taskId: "T5"
  },
  {
    id: "D1-165",
    domain: "1 - Information System Auditing Process",
    category: "Reporting and Communication Techniques",
    question: "An information systems (IS) auditor is determining the appropriate sample size for testing the existence of program change approvals. In this context, the IS auditor can adopt a:",
    choices: {
      A: "Lower confidence coefficient, resulting in a smaller sample size.",
      B: "Higher confidence coefficient, resulting in a smaller sample size.",
      C: "Higher confidence coefficient, resulting in a larger sample size.",
      D: "Lower confidence coefficient, resulting in a larger sample size."
    },
    correctAnswer: "A",
    justification: {
      A: "Strong controls allow lower confidence and smaller samples.",
      B: "Higher confidence increases sample size.",
      C: "Higher confidence is unnecessary here.",
      D: "Lower confidence reduces sample size."
    },
    taskStatement: "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
    taskId: "T4"
  },
  {
    id: "D1-166",
    domain: "1 - Information System Auditing Process",
    category: "Reporting and Communication Techniques",
    question: "An external information systems (IS) auditor recommends a specific firewall vendor in an audit report. The IS auditor failed to exercise:",
    choices: {
      A: "Professional independence.",
      B: "Organizational independence.",
      C: "Technical competence.",
      D: "Professional competence."
    },
    correctAnswer: "A",
    justification: {
      A: "Recommending a vendor compromises independence.",
      B: "Organizational independence is unrelated.",
      C: "Technical competence is not the issue.",
      D: "Professional competence is not the issue."
    },
    taskStatement: "Plan an audit to determine whether information systems are protected, controlled, and provide value to the organization",
    taskId: "T1"
  },
  {
    id: "D1-167",
    domain: "1 - Information System Auditing Process",
    category: "Reporting and Communication Techniques",
    question: "A substantive test to verify that tape library inventory records are accurate is:",
    choices: {
      A: "Determining whether bar code readers are installed.",
      B: "Determining whether the movement of tapes is authorized.",
      C: "Conducting a physical count of the tape inventory.",
      D: "Checking whether receipts and issues of tapes are accurately recorded."
    },
    correctAnswer: "C",
    justification: {
      A: "This is a compliance test.",
      B: "This is a compliance test.",
      C: "Physical count is substantive testing.",
      D: "This is a compliance test."
    },
    taskStatement: "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
    taskId: "T4"
  },
  {
    id: "D1-168",
    domain: "1 - Information System Auditing Process",
    category: "Reporting and Communication Techniques",
    question: "An information systems (IS) auditor observes a potential zero-day exposure. The BEST approach is to:",
    choices: {
      A: "Document the finding only.",
      B: "Alter firewall rules immediately.",
      C: "Patch the system immediately.",
      D: "Discuss the findings with management along with evidence."
    },
    correctAnswer: "D",
    justification: {
      A: "Management must be informed first.",
      B: "Auditors must not alter systems.",
      C: "Root cause must be assessed.",
      D: "Findings must be discussed with management."
    },
    taskStatement: "Evaluate the organization's management of IT policies and practices, including compliance with legal and regulatory requirements",
    taskId: "T11"
  },
  {
    id: "D1-169",
    domain: "1 - Information System Auditing Process",
    category: "Reporting and Communication Techniques",
    question: "In a small organization, release manager and application programmer roles are combined. The BEST compensating control is:",
    choices: {
      A: "Hiring additional staff.",
      B: "Preventing program modifications.",
      C: "Logging development library changes.",
      D: "Verifying that only approved program changes are implemented."
    },
    correctAnswer: "D",
    justification: {
      A: "This is a preventive control.",
      B: "Not feasible in small organizations.",
      C: "Does not detect production changes.",
      D: "Verifies authorized changes."
    },
    taskStatement: "Utilize data analytics tools to enhance audit processes",
    taskId: "T6"
  },
  {
    id: "D1-170",
    domain: "1 - Information System Auditing Process",
    category: "Reporting and Communication Techniques",
    question: "An auditee disagrees with an audit finding. The BEST action is to:",
    choices: {
      A: "Discuss the finding with the audit manager.",
      B: "Retest the control.",
      C: "Elevate the risk.",
      D: "Discuss directly with auditee management."
    },
    correctAnswer: "A",
    justification: {
      A: "The audit manager should handle disagreements.",
      B: "Retesting may be unnecessary.",
      C: "Does not resolve disagreement.",
      D: "Escalation should follow internal discussion."
    },
    taskStatement: "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
    taskId: "T4"
  },
  {
    id: "D1-171",
    domain: "1 - Information System Auditing Process",
    category: "Reporting and Communication Techniques",
    question: "An information systems (IS) auditor performing a review of application controls evaluates the:",
    choices: {
      A: "Efficiency of the application.",
      B: "Impact of exposures discovered.",
      C: "Business processes served.",
      D: "Application optimization."
    },
    correctAnswer: "B",
    justification: {
      A: "Efficiency is not the focus.",
      B: "Application control reviews assess exposures.",
      C: "Process review is outside scope.",
      D: "Optimization is not the objective."
    },
    taskStatement: "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
    taskId: "T4"
  },
  {
    id: "D1-172",
    domain: "1 - Information System Auditing Process",
    category: "Reporting and Communication Techniques",
    question: "Which of the following is the MOST reliable audit evidence?",
    choices: {
      A: "Third-party confirmation.",
      B: "Management assurance.",
      C: "Internet trend data.",
      D: "Auditor-developed ratios."
    },
    correctAnswer: "A",
    justification: {
      A: "Independent third-party evidence is most reliable.",
      B: "Management assurance lacks objectivity.",
      C: "Internet data is unreliable.",
      D: "Analytical results are not primary evidence."
    },
    taskStatement: "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
    taskId: "T4"
  },
  {
    id: "D1-173",
    domain: "1 - Information System Auditing Process",
    category: "Reporting and Communication Techniques",
    question: "When an IS auditor detects a virus, the NEXT step is to:",
    choices: {
      A: "Observe response mechanisms.",
      B: "Remove the virus.",
      C: "Inform appropriate personnel immediately.",
      D: "Ensure deletion."
    },
    correctAnswer: "C",
    justification: {
      A: "Notification must occur first.",
      B: "Auditors must not intervene.",
      C: "Personnel must be informed immediately.",
      D: "Removal is management’s responsibility."
    },
    taskStatement: "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
    taskId: "T4"
  },
  {
    id: "D1-174",
    domain: "1 - Information System Auditing Process",
    category: "Reporting and Communication Techniques",
    question: "Which approach BEST identifies overlapping key controls?",
    choices: {
      A: "Reviewing complex processes.",
      B: "Using integrated test facilities.",
      C: "Automated monitoring solutions.",
      D: "Control testing."
    },
    correctAnswer: "C",
    justification: {
      A: "Complexity does not reveal overlap.",
      B: "ITF tests accuracy, not overlap.",
      C: "Automation reveals redundant controls.",
      D: "Testing alone is insufficient."
    },
    taskStatement: "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
    taskId: "T4"
  },
  {
    id: "D1-175",
    domain: "1 - Information System Auditing Process",
    category: "Reporting and Communication Techniques",
    question: "When outsourced monitoring is inadequate and management disagrees, the IS auditor should:",
    choices: {
      A: "Revise the finding.",
      B: "Retract the finding.",
      C: "Ignore management feedback.",
      D: "Document the finding."
    },
    correctAnswer: "D",
    justification: {
      A: "Findings should not be revised without cause.",
      B: "Controls do not negate the finding.",
      C: "Feedback should be documented.",
      D: "Findings must be documented."
    },
    taskStatement: "Conduct audits in accordance with IS audit standards and a risk based IS audit strategy",
    taskId: "T2"
  },
  {
    id: "D1-176",
    domain: "1 - Information System Auditing Process",
    category: "Reporting and Communication Techniques",
    question: "Statistical sampling should be used when:",
    choices: {
      A: "Probability of error must be quantified.",
      B: "Sampling risk must be avoided.",
      C: "Audit software is unavailable.",
      D: "Tolerable error is unknown."
    },
    correctAnswer: "A",
    justification: {
      A: "Statistical sampling quantifies error probability.",
      B: "Sampling risk always exists.",
      C: "Software is not required.",
      D: "Tolerable error must be defined."
    },
    taskStatement: "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
    taskId: "T4"
  },
  {
    id: "D1-177",
    domain: "1 - Information System Auditing Process",
    category: "Reporting and Communication Techniques",
    question: "When auditing risk assessment, the FIRST confirmation should be that:",
    choices: {
      A: "Threats are identified.",
      B: "Vulnerabilities are analyzed.",
      C: "Assets are identified and ranked.",
      D: "Impacts are evaluated."
    },
    correctAnswer: "C",
    justification: {
      A: "Threat analysis follows asset identification.",
      B: "Vulnerability analysis follows asset identification.",
      C: "Asset identification sets scope.",
      D: "Impact depends on asset value."
    },
    taskStatement: "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
    taskId: "T4"
  },
  {
    id: "D1-178",
    domain: "1 - Information System Auditing Process",
    category: "Reporting and Communication Techniques",
    question: "The BEST evidence of effectiveness for exception report review is:",
    choices: {
      A: "Walk-throughs.",
      B: "Signed reports.",
      C: "Reports with documented follow-up.",
      D: "Management confirmation."
    },
    correctAnswer: "C",
    justification: {
      A: "Walk-throughs show design only.",
      B: "Sign-off alone is insufficient.",
      C: "Follow-up demonstrates effectiveness.",
      D: "Management lacks independence."
    },
    taskStatement: "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
    taskId: "T4"
  },
  {
    id: "D1-179",
    domain: "1 - Information System Auditing Process",
    category: "Reporting and Communication Techniques",
    question: "The extent of data collection during an IS audit should be based on the:",
    choices: {
      A: "Availability of information.",
      B: "Auditor familiarity.",
      C: "Auditee capability.",
      D: "Purpose and scope of the audit."
    },
    correctAnswer: "D",
    justification: {
      A: "Availability must not constrain scope.",
      B: "Familiarity must not bias audit.",
      C: "Evidence availability must be ensured.",
      D: "Scope and purpose determine data needs."
    },
    taskStatement: "Communicate and collect feedback on audit progress, findings, results, and recommendations with stakeholders",
    taskId: "T4"
  }
];
