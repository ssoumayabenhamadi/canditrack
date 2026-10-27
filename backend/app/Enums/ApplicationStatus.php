<?php

namespace App\Enums;

enum ApplicationStatus: string
{
    case ToApply = 'to_apply';
    case Sent = 'sent';
    case Interview = 'interview';
    case Offer = 'offer';
    case Rejected = 'rejected';
}