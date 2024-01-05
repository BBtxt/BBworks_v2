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
					viewBox="0 0 180 180"
					xmlns="http://www.w3.org/2000/svg"
					xml:space="preserve"
					style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5"
					width="180"
					height="180"
				>
					<path
						d="m98.428 25.935 6.739 5.412 -34.077 13.392 -0.012 90.819 -6.096 -5.358 -0.2 -90.892 33.647 -13.374Zm-35.053 102.542 -6.199 -5.678 -0.137 -89.685 34.199 -13.152 5.931 4.922 -33.84 13.199 0.047 90.394Z"
						style="fill:#3499cb"
					/>
					<path
						d="m103.011 91.478 6.057 -2.254 -0.054 21.554 -28.876 10.995v-7.809l22.764 -9.254 0.109 -13.231Z"
						style="fill:#cb3434"
					/>
					<path
						d="m110.52 88.634 6.095 -2.643 0.104 32.176 -36.581 13.589v-7.222l30.377 -12.438 0.005 -23.461Z"
						style="fill:#cb3434"
					/>
					<path
						d="m72.355 45.786 6.155 5.395 28.24 -10.593V80.223L78.574 98.671 118.094 83.496l0.236 35.892 -39.599 15.495 -0.248 -83.71 28.267 -18.672 5.721 5.433 0.145 33.536 3.77 3.129 -3.824 1.116 0.106 2.239s5.243 -1.843 5.2 -2.045c-0.044 -0.202 6.319 5.331 6.319 5.331l0.215 44.088 -45.708 17.847 -6.142 -5.959 -0.195 -91.428 34.394 -13.285 -28.24 18.68 -6.155 -5.395ZM78.574 91.251l0 7.483 28.406 -18.696 -28.407 11.214Z"
						style="fill:#3499cb;stroke:#3499cb;stroke-width:1px"
					/>
					<path
						d="m91.583 48.045 -0.345 19.612 -11.1 4.248v7.66l17.394 -6.827 -0.059 -26.595 -5.89 1.902Zm13.584 31.157 -25.029 9.48v-7.374l18.905 -7.428 -0.015 -28.493 6.075 -2.058 0.065 35.872Z"
						style="fill:#cb3434"
					/>
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
