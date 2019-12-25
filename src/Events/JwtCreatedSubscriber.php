<?php

namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber
{

    public function updateJwtData(JWTCreatedEvent $event)
    {
        $user = $event->getUser();

        $data = $event->getData();
        $data['firtName'] = $user->getFirstName();
        $data['lastName'] = $user->getLastName();

        $event->setData($data);
    }
}
