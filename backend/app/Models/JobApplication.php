<?php

namespace App\Models;

use App\Enums\ApplicationStatus;
use Database\Factories\JobApplicationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $company
 * @property string $position
 * @property string|null $location
 * @property string|null $url
 * @property ApplicationStatus $status
 * @property Carbon|null $applied_at
 * @property string|null $notes
 * @property string|null $offer_text
 * @property array{score: int, summary: string, matching_skills: list<string>, missing_skills: list<string>}|null $analysis
 * @property Carbon|null $analyzed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['company', 'position', 'location', 'url', 'status', 'applied_at', 'notes'])]
class JobApplication extends Model
{
    /** @use HasFactory<JobApplicationFactory> */
    use HasFactory;

    /**
     * Nombre de jours sans réponse avant de conseiller une relance.
     */
    public const FOLLOW_UP_AFTER_DAYS = 7;

    /**
     * Valeurs par défaut d'une nouvelle candidature.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'status' => 'sent',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ApplicationStatus::class,
            'applied_at' => 'date',
            'analysis' => 'array',
            'analyzed_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Une relance est conseillée si la candidature est envoyée depuis au moins 7 jours.
     */
    public function needsFollowUp(): bool
    {
        return $this->status === ApplicationStatus::Sent
            && $this->applied_at !== null
            && $this->applied_at->lte(now()->subDays(self::FOLLOW_UP_AFTER_DAYS));
    }
}
