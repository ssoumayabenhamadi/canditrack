<?php

namespace App\Exceptions;

use RuntimeException;

/**
 * Levée quand l'analyse IA d'une offre échoue (clé manquante, API indisponible, réponse invalide).
 */
class OfferAnalysisException extends RuntimeException
{
}
