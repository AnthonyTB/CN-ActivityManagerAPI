BEGIN;

    INSERT INTO activities
        (title, description, date_created, creator)
    VALUES
        ('Disco Time', 'Everyone get up and dance like crazy for 15 seconds', now(), 'Brittany'),
        ('Favorite Video Game', 'Everyone says their favorite video game', now(), 'Anthony'),
        ('Favorite Food Cuisine', 'Everyone says their favorite kind of food', now(), 'Anthony'),
        ('Favorite Movie', 'Everyone says their favorite movie?', now(), 'Brittany'),
        ('Favorite Memory', 'Everyone says their favorite memory', now(), 'Brittany');

END;