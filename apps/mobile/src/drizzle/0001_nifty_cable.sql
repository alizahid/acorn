CREATE TABLE `collapsed` (
	`commentId` text PRIMARY KEY NOT NULL,
	`postId` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `filters` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `history` (
	`postId` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sorting` (
	`communityId` text PRIMARY KEY NOT NULL,
	`sort` text NOT NULL,
	`interval` text
);
