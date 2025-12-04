export function formatJSON(input: string): { ok: boolean; output: string } {
    try {
        const parsed = JSON.parse(input);
        return { ok: true, output: JSON.stringify(parsed, null, 2) };
    } catch (e: unknown) {
        return { ok: false, output: e instanceof Error ? e.message : String(e) };
    }
}

export function minifyJSON(input: string): { ok: boolean; output: string } {
    try {
        const parsed = JSON.parse(input);
        return { ok: true, output: JSON.stringify(parsed) };
    } catch (e: unknown) {
        return { ok: false, output: e instanceof Error ? e.message : String(e) };
    }
}

export function validateJSON(input: string): { ok: boolean; output: string } {
    try {
        JSON.parse(input);
        return { ok: true, output: "✓ Valid JSON - Your JSON is properly formatted!" };
    } catch (e: unknown) {
        return { ok: false, output: e instanceof Error ? e.message : String(e) };
    }
}