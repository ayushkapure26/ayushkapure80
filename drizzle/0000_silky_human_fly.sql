CREATE TABLE `bookings` (
	`sequence` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`id` text NOT NULL,
	`user_id` text NOT NULL,
	`station_id` text NOT NULL,
	`request_key` text NOT NULL,
	`driver_name` text NOT NULL,
	`phone` text NOT NULL,
	`vehicle_type` text NOT NULL,
	`vehicle_no` text NOT NULL,
	`quantity` text NOT NULL,
	`scheduled_at` text NOT NULL,
	`status` text DEFAULT 'Active' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`station_id`) REFERENCES `stations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_id` ON `bookings` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_request` ON `bookings` (`user_id`,`request_key`);--> statement-breakpoint
CREATE INDEX `bookings_user` ON `bookings` (`user_id`,`sequence`);--> statement-breakpoint
CREATE INDEX `bookings_station_queue` ON `bookings` (`station_id`,`status`,`scheduled_at`);--> statement-breakpoint
CREATE TABLE `favorites` (
	`user_id` text NOT NULL,
	`station_id` text NOT NULL,
	FOREIGN KEY (`station_id`) REFERENCES `stations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `favorites_user_station` ON `favorites` (`user_id`,`station_id`);--> statement-breakpoint
CREATE TABLE `stations` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`city` text NOT NULL,
	`address` text NOT NULL,
	`status` text DEFAULT 'Open' NOT NULL,
	`price` real NOT NULL,
	`pressure` integer NOT NULL,
	`nozzles` integer NOT NULL,
	`hours` text NOT NULL,
	`vehicles` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `stations_owner` ON `stations` (`owner_id`);