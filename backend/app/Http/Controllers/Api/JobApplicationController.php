<?php

namespace App\Http\Controllers\Api;

use App\Enums\ApplicationStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\JobApplicationRequest;
use App\Http\Resources\JobApplicationResource;
use App\Models\JobApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class JobApplicationController extends Controller
{
    /**
     * Liste des candidatures de l'utilisateur, filtrables par statut (?status=interview).
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'status' => ['nullable', Rule::enum(ApplicationStatus::class)],
        ]);

        $applications = $request->user()
            ->jobApplications()
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->input('status')))
            ->latest('applied_at')
            ->latest('id')
            ->paginate(15);

        return JobApplicationResource::collection($applications);
    }

    /**
     * Création d'une candidature pour l'utilisateur connecté.
     */
    public function store(JobApplicationRequest $request): JsonResponse
    {
        $application = $request->user()->jobApplications()->create($request->validated());

        return JobApplicationResource::make($application)
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Détail d'une candidature.
     */
    public function show(JobApplication $application): JobApplicationResource
    {
        Gate::authorize('view', $application);

        return JobApplicationResource::make($application);
    }

    /**
     * Modification d'une candidature (par exemple son statut).
     */
    public function update(JobApplicationRequest $request, JobApplication $application): JobApplicationResource
    {
        Gate::authorize('update', $application);

        $application->update($request->validated());

        return JobApplicationResource::make($application);
    }

    /**
     * Suppression d'une candidature.
     */
    public function destroy(JobApplication $application): Response
    {
        Gate::authorize('delete', $application);

        $application->delete();

        return response()->noContent();
    }
}