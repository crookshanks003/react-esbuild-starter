import esbuild from "esbuild";
import fs from "fs";
import server from "create-serve";

function copyIndexHtml() {
	fs.copyFile("public/index.html", "dist/index.html", (err) => {
		if (err) {
			console.log("Error Found:", err);
		}
	});
}

function build() {
	copyIndexHtml();
	esbuild.build({
		entryPoints: ["src/index.tsx"],
		bundle: true,
		minify: true,
		sourcemap: true,
		loader: { ".png": "dataurl", ".jpg": "dataurl" },
		outfile: "dist/bundle.js",
	});
}

function watch() {
	copyIndexHtml();
	esbuild
		.build({
			entryPoints: ["src/index.tsx"],
			bundle: true,
			minify: true,
			sourcemap: true,
			loader: { ".png": "dataurl", ".jpg": "dataurl" },
			outfile: "dist/bundle.js",
			watch: {
				onRebuild(err) {
					server.update();
					if (err) {
						console.log("Could not update files: ", err);
					}
				},
			},
		})
		.catch((err) => console.log("Could not build: ", err));

	server.start({ port: 3000, root: "dist/" });
}

function main() {
	const args = process.argv;
	const flag = args[2];

	switch (flag) {
		case "-w":
			watch();
			break;
		default:
			build();
	}
}

main();
