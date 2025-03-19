import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pqgbldqqlqkumnrgdcji.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZ2JsZHFxbHFrdW1ucmdkY2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMjYwOTcsImV4cCI6MjA1NzkwMjA5N30.EJBMGz-uFaQCO6m6lVktOla6DIe-s1Ml5OVfAv59ws4";

export const supabase = createClient(supabaseUrl, supabaseKey);
