<?php

namespace Database\Factories;

use App\Enums\ApplicationStatus;
use App\Models\JobApplication;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<JobApplication>
 */
class JobApplicationFactory extends Factory
{
    /**
     * Données de test réalistes pour une candidature.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'company' => fake()->company(),
            'position' => fake()->randomElement([
                'Développeuse Full Stack PHP',
                'Développeuse Laravel / React',
                'Développeuse Symfony',
                'Développeuse Front-End React',
            ]),
            'location' => fake()->city(),
            'url' => fake()->url(),
            'status' => ApplicationStatus::Sent,
            'applied_at' => fake()->dateTimeBetween('-30 days', 'now'),
            'notes' => null,
        ];
    }
}