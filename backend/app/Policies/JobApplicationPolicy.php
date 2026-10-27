<?php

namespace App\Policies;

use App\Models\JobApplication;
use App\Models\User;

/**
 * Règle d'accès : une candidature n'est visible et modifiable que par son propriétaire.
 */
class JobApplicationPolicy
{
    public function view(User $user, JobApplication $jobApplication): bool
    {
        return $this->owns($user, $jobApplication);
    }

    public function update(User $user, JobApplication $jobApplication): bool
    {
        return $this->owns($user, $jobApplication);
    }

    public function delete(User $user, JobApplication $jobApplication): bool
    {
        return $this->owns($user, $jobApplication);
    }

    private function owns(User $user, JobApplication $jobApplication): bool
    {
        return (int) $jobApplication->user_id === $user->id;
    }
}