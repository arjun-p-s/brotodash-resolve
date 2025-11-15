-- Add foreign key constraint from issues.student_id to profiles.id
ALTER TABLE public.issues
ADD CONSTRAINT fk_issues_student_id
FOREIGN KEY (student_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;