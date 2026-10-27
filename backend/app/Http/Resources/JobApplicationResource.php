<?php

namespace App\Http\Resources;

use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Format JSON d'une candidature renvoyé par l'API.
 *
 * @mixin JobApplication
 */
class JobApplicationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company' => $this->company,
            'position' => $this->position,
            'location' => $this->location,
            'url' => $this->url,
            'status' => $this->status->value,
            'applied_at' => $this->applied_at?->toDateString(),
            'notes' => $this->notes,
            'needs_follow_up' => $this->needsFollowUp(),
            'offer_text' => $this->offer_text,
            'analysis' => $this->analysis,
            'analyzed_at' => $this->analyzed_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
