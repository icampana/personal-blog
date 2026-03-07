#!/usr/bin/env node

/**
 * Conditionally builds TinaCMS admin interface
 * Only runs if TINA_CLIENT_ID and TINA_TOKEN environment variables are set
 * This allows CI/CD to skip TinaCMS build when credentials aren't available
 */

import { execSync } from "node:child_process";

const hasCredentials =
	process.env.TINA_CLIENT_ID && process.env.TINA_TOKEN;

if (hasCredentials) {
	console.log("✓ TinaCMS credentials found, building admin interface...");
	try {
		execSync("tinacms build", { stdio: "inherit" });
		console.log("✓ TinaCMS build completed successfully");
	} catch (error) {
		console.error("✗ TinaCMS build failed:", error.message);
		process.exit(1);
	}
} else {
	console.log(
		"ℹ TinaCMS credentials not found (TINA_CLIENT_ID, TINA_TOKEN)",
	);
	console.log("  Skipping TinaCMS build - admin interface will not be available");
	console.log(
		"  This is expected in CI/CD environments and won't affect the static site build",
	);
}
