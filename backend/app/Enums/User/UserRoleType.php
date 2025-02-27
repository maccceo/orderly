<?php

namespace App\Enums\User;

enum UserRoleType: string
{
    case USER = 'user';
    case ADMIN = 'admin';
}
