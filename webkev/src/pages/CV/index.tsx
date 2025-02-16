import { Employer as EmployerType } from "../../models/Employer";
import { Employer } from "../../components/Employer";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import styles from "./style.module.css";
import { useFillLines } from "../../hooks/useFillLines";
import { Project } from "../../models/Project";
import { useState } from "preact/hooks";
import { ProjectDetail } from "../../components/ProjectDetail";

const employers: EmployerType[] = [
	{
		name: "Whereby",
		website: "whereby.com",
		description: "Standalone or embedded video calls powered by WebRTC",
		duration: "Jul 2023 - Present",
		durationShort: "7/23 - now",
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
				name: "AI Speech-to-Text service",
				description:
					"Host our own STT service for meeting captions and transcription",
				detail: `
Live captions and meeting transcriptions are currently provided by streaming meeting audio to a third party service. As part of a year-end hackathon, I had a crack at spinning up a service to create these real-time transcriptions ourselves.

At the end of the week I had a proof of concept service running that was able to privide transcriptions with comparable performance to our current third party solution.

After running the numbers for the cost of this hacked together service, we determined it was about 5x cheaper in it's current unoptimised state than the third party provider, opening up a possibility for significant savings on this front.
				`,
			},
			{
				name: "Webhook Insights",
				description:
					"Allow developers to see a history of webhook events from their Whereby meetings",
				detail: `
Whereby delivers about 20,000 webhooks to customer endpoints every day. To make developers lives easier when implementing or debugging webhooks, we decided to provide a dashboard that shows a customer all their webhook deliveries for the past 30 days.

On delivery (success or failure), the details of the webhook event are pushed to a Kinsis Firehose that eventually writes the data to an AWS Redshift database.

Alongside this we added a notification email that will let users know if something went wrong when trying to deliver the webhook.
				`,
			},
			{
				name: "Dial-In",
				description:
					"Allow users to dial into a video call from their telephone over PSTN",
				detail: `
As Whereby started to chase larger clients (espeically American clients for some reason...), it became apparent there was a need for end users to be able to join Whereby rooms from their phones via PSTN.

This feature was explored several years prior to me joining the team and was postponed due to the expected complexity and little demand for the feature.
After it was ressurected, I was tasked with investigating possible solutions and estimating delivery of the feature. In a two weeks I put together a proof of concept and could demonstrate dialling into a room with acceptible quality and latency.

After designing a production implementation, dial-in was enabled for the first customer about 3 months after the project began.
				`,
			},
			{
				name: "Live Captions",
				description:
					"Transcribe and display captions for all participants in real time",
				detail: `
The work on accessibility improvements raised the need for live captions.

I experimented with some P2P solutions where each participant generates their own captions locally, but browser compatibility and performance issues led us to settle on centralised captions generated by a server process and third-party live transcription service.

The fully diarised and timestamped captions generated this way allowed the team to quickly extend captioning functionality to full meeting transcriptions, and even prototype live translation.
				`,
			},
		],
	},
	{
		name: "Contact",
		website: "contact.xyz",
		description: "Online marketplace for creatives in the fashion industry",
		duration: "May 2021 - Jun 2023",
		durationShort: "5/21 - 6/23",
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
				detail: `
Jobs on the Contact platform were historically paid by invoice, usually well after the job had completed. This caused issues getting payments to models and photographers on these jobs, and so the team looked into adding a checkout flow to enable payments upfront.

The lead engineer and I developed the flow and integrated a third party payment platform, gradually enabling it for select booking agents.

After the roll out, upwards of 40% of jobs booked on the platform went through the upfront payment flow.
				`,
			},
			{
				name: "Natural Language Job Creation API",
				description:
					"Leverage AI to create jobs from natural language descriptions",
				detail: `
A large proportion of jobs booked on the Contact platform were from bookers emailing the internal booking team with a description of the job they'd like to book and what kind of creatives they were looking for.

This made for a nice high-touch experience for the booker, but was very inefficient in terms of time spent booking each job.

I had the idea to use an LLM to convert these natural language descriptions into structured data that we could inject into our database to reduce the manual workload of creating a job - info like date, location, budget, number of models required etc could be acccurately extracted by the LLM and the booking team's manual input was greatly reduced.
				`,
			},
			{
				name: "Talent Query Performance Improvements",
				description:
					"Optimise talent search queries, improving performance by over 50%",
				detail: `
The main function of contact.xyz is to act as a sort of marketplace for models and photographers - booking agents would peruse the talent on the platform, choose people they thought matched the style of their booking, and then go on to enter extra details and submit the job.

Unfortunately the talent search query was quite slow - up to 1 second for each request.

After some research, I deduced the problem was nested objects requiring multiple database calls to complete the query - also known as the n+1 problem.

I added some small tweaks to the query handling and managed to reduce the average query time down to under 400ms.
				`,
			},
		],
	},
	{
		name: "FutureFarm",
		website: "futurefarm.ag",
		technologies: ["PHP", "Symfony", "GCP", "MySQL"],
		description:
			"E-commerce platform helping farmers lower costs by pooling their buying power",
		duration: "Jan 2020 - May 2021",
		durationShort: "1/20 - 5/21",
		projects: [
			{
				name: "PDF Invoice Delivery",
				description:
					"Deliver order invoices to client Google Drives after checkout",
				detail: `
Farmers and buyers groups would place an order on the FutureFarm marketplace, but there was a manual step required for a FutureFarm admin to generate a PDF invoice and send it to the designated email address for the buyer.

I created a microservice that automated this process, and (when configured by the buyer) could also insert the invoice into a Google Drive folder.
				`,
			},
			{
				name: "Test Suite Optimisation",
				description:
					"Reduce local test suite runtime from ~40 minutes to under 5 minutes",
				detail: `
When I joined FutureFarm, the full backend test suite ran on SQLite when run locally, in contrast to the production/CI MySQL database. What's more, for each test group the entire database was recreated and re-seeded - a very time consuming proceedure.

First I changed the test suite to run against a local Postgres database, then wrote a small script to shard the suites into multiple threads targeting multiple databases.

The final result was a local test suite that was actually usable and better reflected the production environment.
				`,
			},
		],
	},
];

export function CV() {
	const [lineNumbersRef, lines] = useFillLines();
	const [activeProject, setActiveProject] = useState<Project>();
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
				{activeProject && (
					<ProjectDetail
						content={activeProject.detail}
						onClose={() => setActiveProject(undefined)}
					/>
				)}
			</div>
		</div>
	);
}
