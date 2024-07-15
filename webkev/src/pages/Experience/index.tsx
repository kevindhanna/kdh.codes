import { Employer as EmployerType } from "../../models/Employer";
import { Employer } from "../../components/Employer";
import { useState } from "preact/hooks";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Project } from "../../models/Project";
import styles from "./style.module.css";
import { useFillLines } from "../../hooks/useFillLines";
import { ProjectDetail } from "../../components/ProjectDetail";

const employers: EmployerType[] = [
	{
		name: "Whereby",
		website: "whereby.com",
		description: "Standalone or embedded video calls powered by WebRTC",
		duration: "Jul 2023 - Present (1y)",
		technologies: [
			"Typescript",
			"NodeJS",
			"Express",
			"React",
			"AWS",
			"Terraform",
			"Docker",
			"Kubernetes",
			"Postgres",
		],
		projects: [
			{
				name: "Dial-In",
				description:
					"Allow users to dial into a video call from their telephone over PSTN",
				detail: `
As Whereby started to chase larger clients (espeically American clients for some reason...), it became apparent there was a need for end users to be able to join Whereby rooms from their phones via PSTN.

This feature was explored several years prior to me joining the team and was postponed due to the expected complexity and little demand for the feature.
After it was ressurected, I was tasked with exploring possible solutions and estimating delivery of the feature. In a two weeks I put together a proof of concept and could demonstrate dialling into a room with acceptible quality and latency.

A further few weeks were spent designing a production implementation to the solution, which is in development as you read this.
				`,
			},
			{
				name: "Live Captions",
				description:
					"Transcribe and display captions for all participants in real time",
				detail: "",
			},
			{
				name: "Accessibility Improvements",
				description:
					"Bring the Whereby meeting experience in line with the WCAG 2.1 guidelines",
				detail: "",
			},
		],
	},
	{
		name: "Contact",
		website: "contact.xyz",
		description: "Online marketplace for creatives in the fashion industry",
		duration: "May 2021 - Jun 2023 (2y 1m)",
		technologies: [
			"Typescript",
			"React",
			"Ruby/Rails",
			"React",
			"React Native",
			"Terraform",
			"Postgres",
		],
		projects: [
			{
				name: "Checkout and Payments",
				description:
					"Allow job payment at checkout, enabling 40% of jobs to be paid upfront",
				detail: "",
			},
			{
				name: "Natural Language Job Creation API",
				description:
					"Leverage AI to create jobs from natural language descriptions",
				detail: "",
			},
			{
				name: "Talent Query Performance Improvements",
				description:
					"Optimise talent search queries, improving performance by over 50%",
				detail: "",
			},
		],
	},
	{
		name: "FutureFarm",
		website: "futurefarm.ag",
		technologies: ["PHP", "Symfony", "GCP", "MySQL"],
		description:
			"E-commerce platform helping farmers lower costs by pooling their buying power",
		duration: "Jan 2020 - May 2021 (1y 4m)",
		projects: [
			{
				name: "PDF Invoice Delivery",
				description:
					"Deliver order invoices to client Google Drives after checkout",
				detail: "",
			},
			{
				name: "Test Suite Optimisation",
				description:
					"Reduce local test suite runtime from ~40 minutes to under 5 minutes",
				detail: "",
			},
		],
	},
];

export function Experience() {
	const [activeProject, setActiveProject] = useState<Project>();
	const [lineNumbersRef, lines] = useFillLines();
	return (
		<div className={styles.container}>
			<div className={styles.pageContainer}>
				<Breadcrumbs />
				<div ref={lineNumbersRef} className={styles.page}>
					<pre className={styles.lineNumbers}>{lines}</pre>
					<div className={styles.employersList}>
						{employers.map((e) => (
							<section>
								<Employer {...e} setActiveProject={setActiveProject} />
								<br />
							</section>
						))}
					</div>
				</div>
			</div>
			<ProjectDetail
				content={activeProject?.detail}
				visible={!!activeProject}
			/>
		</div>
	);
}
