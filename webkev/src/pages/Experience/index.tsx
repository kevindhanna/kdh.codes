import { Employer as EmployerType } from "../../models/Employer";
import { Employer } from "../../components/Employer";
import styles from "./style.module.css";

const employers: EmployerType[] = [
	{
		name: "Whereby",
		website: "whereby.com",
		description: "Standalone or embedded video calls powered by WebRTC",
		projects: [
			{
				name: "Dial-In",
				description:
					"Allow users to dial into a video call from their telephone over PSTN",
			},
			{
				name: "Live Captions",
				description:
					"Transcribe and display captions for all participants in real time",
			},
			{
				name: "Accessibility Improvements",
				description:
					"Bring the Whereby meeting experience in line with the WCAG 2.1 guidelines",
			},
		],
	},
	{
		name: "Contact",
		website: "contact.xyz",
		description: "Online marketplace for creatives in the fashion industry",
		projects: [
			{
				name: "Checkout and Payments",
				description:
					"Accept job payment using a checkout, allowing 40% of jobs to be paid upfront",
			},
			{
				name: "Natural Language Job Creation API",
				description:
					"Leverage Large Language Models to create jobs from natural language descriptions",
			},
			{
				name: "Talent Query Performance Improvements",
				description:
					"Optimise talent search queries, improving performance by over 50%",
			},
		],
	},
];

export function Experience() {
	return (
		<div>
			<div className={styles.employersList}>
				{employers.map((e) => (
					<section>
						<Employer {...e} />
					</section>
				))}
			</div>
		</div>
	);
}
