create table `collapsed` (
	`commentId` text primary key not null,
	`postId` text not null
);

--> statement-breakpoint
create table `filters` (
	`id` text primary key not null,
	`type` text not null,
	`value` text not null
);

--> statement-breakpoint
create table `history` (`postId` text primary key not null);

--> statement-breakpoint
create table `sorting` (
	`communityId` text primary key not null,
	`sort` text not null,
	`interval` text
);