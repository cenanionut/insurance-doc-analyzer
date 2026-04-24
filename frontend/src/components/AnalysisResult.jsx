const AnalysisResult = ({ analysis }) => {
    const { summary, productType, keyClauses, complexityScore } = analysis;

    const scoreColor = complexityScore <= 3 ? '#27ae60'
        : complexityScore <= 6 ? '#f39c12'
            : '#e74c3c';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Product Type + Score */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{
                    background: '#e8f0fe', borderRadius: '8px',
                    padding: '10px 16px', flex: 1, minWidth: '180px'
                }}>
                    <div style={{ fontSize: '11px', color: '#555', fontWeight: '600', textTransform: 'uppercase' }}>
                        Product Type
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#1a3a5c', marginTop: '4px' }}>
                        {productType}
                    </div>
                </div>
                <div style={{
                    background: '#fff8e1', borderRadius: '8px',
                    padding: '10px 16px', minWidth: '140px'
                }}>
                    <div style={{ fontSize: '11px', color: '#555', fontWeight: '600', textTransform: 'uppercase' }}>
                        Complexity Score
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: scoreColor, marginTop: '2px' }}>
                        {complexityScore}<span style={{ fontSize: '13px', color: '#888' }}>/10</span>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '16px' }}>
                <div style={{
                    fontSize: '12px', fontWeight: '700', color: '#2c6fad',
                    textTransform: 'uppercase', marginBottom: '8px'
                }}>
                    Summary
                </div>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.7', color: '#333' }}>
                    {summary}
                </p>
            </div>

            {/* Key Clauses */}
            <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '16px' }}>
                <div style={{
                    fontSize: '12px', fontWeight: '700', color: '#2c6fad',
                    textTransform: 'uppercase', marginBottom: '10px'
                }}>
                    Key Clauses
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {keyClauses.map((clause, i) => (
                        <li key={i} style={{ fontSize: '13.5px', lineHeight: '1.6', color: '#333' }}>
                            {clause}
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
};

export default AnalysisResult;