import type { APIContext, GetStaticPaths } from "astro";
import { getEntryBySlug } from "astro:content";
import satori, { type SatoriOptions } from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import { siteConfig } from "@/site-config";
import { getAllPosts, getFormattedDate } from "@/utils";

import RobotoMono from "@/assets/roboto-mono-regular.ttf";
import RobotoMonoBold from "@/assets/roboto-mono-700.ttf";

const ogOptions: SatoriOptions = {
	width: 1200,
	height: 630,
	// debug: true,
	fonts: [
		{
			name: "Roboto Mono",
			data: Buffer.from(RobotoMono),
			weight: 400,
			style: "normal",
		},
		{
			name: "Roboto Mono",
			data: Buffer.from(RobotoMonoBold),
			weight: 700,
			style: "normal",
		},
	],
};

const markup = (title: string, pubDate: string) =>
	html`<div tw="flex flex-col w-full h-full bg-[#1d1f21] text-[#c9cacc]">
		<div tw="flex flex-col flex-1 w-full p-10 justify-center">
			<p tw="text-2xl mb-6">${pubDate}</p>
			<h1 tw="text-6xl font-bold leading-snug text-white">${title}</h1>
		</div>
		<div tw="flex items-center justify-between w-full p-10 border-t border-[#2bbc89] text-xl">
			<div tw="flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					xmlns:serif="http://www.serif.com/"
					width="100%"
					height="100%"
					viewBox="0 0 261 584"
					version="1.1"
					xml:space="preserve"
					style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
				>
					<g>
						<path
							d="M160.202,28.306l26.082,25.65l-131.896,63.468l-0.047,430.408l-23.596,-25.392l-0.775,-430.751l130.232,-63.383Zm-135.675,485.963l-23.996,-26.908l-0.531,-425.034l132.368,-62.327l22.957,23.325l-130.98,62.554l0.182,428.39Z"
							style="fill:#4f83bc;"
						/>
						<path
							d="M177.938,338.923l23.443,-10.683l-0.209,102.149l-111.764,52.107l-0,-37.009l88.11,-43.858l0.42,-62.706Z"
							style="fill:#d93232;"
						/>
						<path
							d="M207.004,325.447l23.59,-12.527l0.402,152.488l-141.588,64.399l-0,-34.226l117.577,-58.948l0.019,-111.186Z"
							style="fill:#d93232;"
						/>
						<path
							d="M59.283,122.386l23.822,25.57l109.302,-50.201l0,187.831l-110.156,88.359l154.066,-72.847l0.914,170.096l-153.271,73.435l-0.962,-396.713l109.409,-88.489l22.142,25.746l0.562,158.929l14.592,14.831l-14.802,5.286l0.409,10.611c-0,0 20.294,-8.732 20.126,-9.693c-0.167,-0.961 24.457,25.264 24.457,25.264l0.832,208.942l-176.915,84.579l-23.773,-28.242l-0.754,-433.294l133.124,-62.959l-109.302,88.529l-23.822,-25.57Zm22.245,217.484l110.879,-54.284l-110.879,54.284Zm2.365,-1.534l-0.21,34.934l108.724,-87.684l-108.514,52.75Z"
							style="fill:#4f83bc;"
						/>
						<path
							d="M133.706,133.089l-1.338,92.945l-42.96,20.131l-0,36.302l67.325,-32.354l-0.23,-126.038l-22.797,9.014Zm52.578,147.657l-96.876,44.929l-0,-34.947l73.173,-35.201l-0.061,-135.034l23.513,-9.753l0.251,170.006Z"
							style="fill:#d93232;"
						/>
					</g>
				</svg>
				<p tw="ml-3 font-semibold">${siteConfig.title}</p>
			</div>
			<p>by ${siteConfig.author}</p>
		</div>
	</div>`;

export async function GET({ params: { slug } }: APIContext) {
	const post = await getEntryBySlug("post", slug!);
	const title = post?.data.title ?? siteConfig.title;
	const postDate = getFormattedDate(
		post?.data.updatedDate ?? post?.data.publishDate ?? Date.now(),
		{
			weekday: "long",
			month: "long",
		},
	);
	const svg = await satori(markup(title, postDate), ogOptions);
	const png = new Resvg(svg).render().asPng();
	return new Response(png, {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
}

export const getStaticPaths: GetStaticPaths = async () => {
	const posts = await getAllPosts();
	return posts.filter(({ data }) => !data.ogImage).map(({ slug }) => ({ params: { slug } }));
};
