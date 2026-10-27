<?php

namespace App\Http\Requests;

use App\Enums\ApplicationStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JobApplicationRequest extends FormRequest
{
    /**
     * L'accès à la candidature est vérifié dans le contrôleur (policy).
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * En création (POST), l'entreprise et le poste sont obligatoires.
     * En modification (PATCH / PUT), on peut n'envoyer que les champs modifiés.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $required = $this->isMethod('POST') ? 'required' : 'sometimes';

        return [
            'company' => [$required, 'string', 'max:255'],
            'position' => [$required, 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'url' => ['nullable', 'url', 'max:2048'],
            'status' => ['sometimes', Rule::enum(ApplicationStatus::class)],
            'applied_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ];
    }
}