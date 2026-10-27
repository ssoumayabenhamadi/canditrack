<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            $table->text('offer_text')->nullable();      // texte de l'offre analysée
            $table->json('analysis')->nullable();        // résultat de l'IA (score, compétences…)
            $table->timestamp('analyzed_at')->nullable(); // date de la dernière analyse
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            $table->dropColumn(['offer_text', 'analysis', 'analyzed_at']);
        });
    }
};
