/**
 * Maps the raw API response from the analysis service to the internal format
 * used by the frontend components.
 * 
 * @param {Object} data - Raw API data
 * @returns {Object} Mapped result
 */
export const mapAnalysisResponse = (data) => {
    return {
        id: data.analysis_id || data.id || data.object_id,
        analysis_id: data.analysis_id || data.id || data.object_id,
        input_payload: data.input_payload,
        risk_summary: data.risk_summary,
        email_template: data.email_template,
        internal_references: data.internal_references || [],
        external_references: data.external_references || [],
        score: Math.round(data.confidence_score || 0),
        risks: data.risks || [],
        pitch_opportunities: data.pitch_opportunities || [],
        recommended_attorneys: (data.recommended_attorneys || (data.recommended_attorney ? [data.recommended_attorney] : [])).map(att => ({
            ...att,
            id: att.attorney_id || att.id,
            name: att.name || att.title,
            title: att.title || att.name, // Ensure title is available for components expecting it as name
            role: att.role || att.job_title,
            job_title: att.job_title || att.role,
            initials: (att.name || att.title)
                ? (att.name || att.title).split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                : 'XX',
            pastMatters: 18 // Mock value
        })),
        // Fallback for parts of the app still using single attorney
        attorney: data.recommended_attorney ? {
            ...data.recommended_attorney,
            id: data.recommended_attorney.attorney_id || data.recommended_attorney.id,
            name: data.recommended_attorney.name || data.recommended_attorney.title,
            title: data.recommended_attorney.title || data.recommended_attorney.name,
            role: data.recommended_attorney.role || data.recommended_attorney.job_title,
            job_title: data.recommended_attorney.job_title || data.recommended_attorney.role,
            initials: (data.recommended_attorney.name || data.recommended_attorney.title)
                ? (data.recommended_attorney.name || data.recommended_attorney.title).split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                : 'XX',
            pastMatters: 18
        } : null,
        evidence: data.references?.map(ref => ({
            label: ref.label,
            action: 'View',
            url: ref.url
        })) || [],
    };
};
