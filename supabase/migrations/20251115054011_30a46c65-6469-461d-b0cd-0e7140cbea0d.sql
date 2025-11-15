-- Add foreign key constraint from comments.user_id to profiles.id
ALTER TABLE public.comments
ADD CONSTRAINT fk_comments_user_id
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;