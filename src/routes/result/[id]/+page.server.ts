import { supabase } from '$lib/server/db';

export async function load({ params }) {
    const { id } = params;
    
    const { data, error } = await supabase
        .from('medical_reports')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        throw error;
    }

    return {
        result: data
    };
}

export const ssr = false;
