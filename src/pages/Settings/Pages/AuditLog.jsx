import React, { useMemo, useState } from 'react';
import SettingsLayout from '../SettingsLayout';
import { truncateTitle } from '../../../Utils';
import RSTooltip from 'Components/RSTooltip';

const AuditLog = () => {
    // Helper function to generate timestamps within the last 7 days
    const generateRecentTimestamp = (daysAgo) => {
        const now = new Date();
        const pastDate = new Date();
        pastDate.setDate(now.getDate() - daysAgo);

        // Generate random hours and minutes for more realistic timestamps
        const hours = Math.floor(Math.random() * 24);
        const minutes = Math.floor(Math.random() * 60);
        pastDate.setHours(hours, minutes, 0, 0);

        const fullTimestamp = pastDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });

        let relativeTime;
        if (daysAgo === 0) {
            relativeTime = 'Today';
        } else if (daysAgo === 1) {
            relativeTime = '1 day ago';
        } else {
            relativeTime = `${daysAgo} days ago`;
        }

        return { fullTimestamp, relativeTime };
    };

    const initialAuditData = [
        {
            id: 1,
            user: 'Alice Wonderland',
            email: 'alice@example.com',
            module: 'Content Generation',
            action: 'Updated',
            actionType: 'Updated',
            resource: 'AI Response Style',
            details: "Changed response style to 'Concise'",
            ...generateRecentTimestamp(1),
        },
        {
            id: 2,
            user: 'Bob The Builder',
            email: 'bob@example.com',
            module: 'Journey builder',
            action: 'Enabled',
            actionType: 'Enabled',
            resource: 'Data Sharing',
            details: 'Model improvement data sharing was enabled.',
            ...generateRecentTimestamp(2),
        },
        {
            id: 3,
            user: 'Charlie Brown',
            email: 'charlie@example.com',
            module: 'Billing',
            action: 'Assigned',
            actionType: 'Assigned',
            resource: 'User Tokens',
            details: "Assigned 100,000 tokens to user 'diana@example.com'",
            ...generateRecentTimestamp(3),
        },
        {
            id: 4,
            user: 'Alice Wonderland',
            email: 'alice@example.com',
            module: 'Security',
            action: 'Generated',
            actionType: 'Generated',
            resource: 'Report',
            details: 'Generated monthly usage report',
            ...generateRecentTimestamp(5),
        },
        {
            id: 5,
            user: 'System',
            email: 'system@internal',
            module: 'Data augmenetation',
            action: 'Revoked',
            actionType: 'Revoked',
            resource: 'API Key',
            details: "API Key 'prod-key-xxxx' was automatically revoked due to inactivity.",
            ...generateRecentTimestamp(7),
        },
        // {
        //     id: 6,
        //     user: 'System',
        //     email: 'system@internal',
        //     module: 'Data augmenetation',
        //     action: 'Revoked',
        //     actionType: 'Revoked',
        //     resource: 'API Key',
        //     details: "API Key 'prod-key-xxxx' was automatically revoked due to inactivity.",
        //     ...generateRecentTimestamp(7),
        // },
        // {
        //     id: 7,
        //     user: 'Alice Wonderland',
        //     email: 'alice@example.com',
        //     module: 'Security',
        //     action: 'Generated',
        //     actionType: 'Generated',
        //     resource: 'Report',
        //     details: 'Generated monthly usage report',
        //     ...generateRecentTimestamp(5),
        // },
    ].map((item) => ({
        ...item,
        timestamp: item.relativeTime,
    }));
    const [auditData] = useState(initialAuditData);
    const gridData = auditData?.map((item) => ({
        user: item.user,
        email: item.email,
        module: item.module,
        action: item.action,
        actionType: item.actionType,
        resource: item.resource,
        details: item.details,
        timestamp: item.timestamp,
        fullTimestamp: item.fullTimestamp,
    }));
    // Define grid columns
    const columnData = [
        {
            field: 'fullTimestamp',
            title: 'Date & time',
            width: 200,
            cell: (props) => (
                <td>
                    <RSTooltip
                        text={props.dataItem.fullTimestamp}
                        position="top"
                        className="d-inline-block"
                        innerContent={false}
                        tooltipOverlayClass="toolTipOverlayZindexCSS"
                    >
                        <div className="audit-log__timestamp">{props.dataItem.fullTimestamp}</div>
                    </RSTooltip>
                </td>
            ),
        },
        {
            field: 'user',
            title: 'User',
            width: 200,
            cell: (props) => (
                <td>
                    <div className="audit-log__user-cell">
                        <div className="audit-log__user-name">{props.dataItem.user}</div>
                    </div>
                </td>
            ),
        },
        {
            field: 'module',
            title: 'Module',
            width: 190,
            cell: (props) => (
                <td>
                    <div className="audit-log__user-cell">
                        <div className="audit-log__user-name">{props.dataItem.module}</div>
                    </div>
                </td>
            ),
        },

        {
            field: 'resource',
            title: 'Details',
            width: 250,
            cell: (props) => (
                <td>
                    <div className="audit-log__resource-cell">
                        {/* <div className="audit-log__resource-name">{props.dataItem.resource}</div> */}
                        {props.dataItem.details.length > 25 ? (
                            <RSTooltip
                                text={props.dataItem.details}
                                position="top"
                                className="d-inline-block"
                                innerContent={false}
                                tooltipOverlayClass="toolTipOverlayZindexCSS"
                            >
                                <div className="audit-log__resource-details">
                                    {truncateTitle(props.dataItem.details, 25)}
                                </div>
                            </RSTooltip>
                        ) : (
                            <div className="audit-log__resource-details">{props.dataItem.details}</div>
                        )}
                    </div>
                </td>
            ),
        },

        {
            field: 'action',
            title: 'Status',
            width: 150,
            cell: (props) => (
                <td>
                    <span className={`audit-log__action-badge }`}>{props.dataItem.actionType}</span>
                </td>
            ),
        },
    ];

    const pageData = useMemo(
        () => ({
            isHeader: [
                {
                    headerTitle: 'Audit log',
                    headerSubTitle: 'Track important changes and activities within the system.',
                },
            ],
            mainSection: [
                {
                    title: 'Activity history',
                    subtitle: 'A chronological record of actions performed by users and the system.',
                    mainContent: {
                        type: '',
                    },
                    isbutton: false,
                    buttonText: '',
                    buttonPosition: 'center',
                    isGrid: true,
                    gridData: gridData,
                    columnData: columnData,
                    isSearch: false,
                    isfooter: true,
                    footerText: 'Logs are retained for 90 days. Contact support for older records.',
                    chart: false,
                    chartData: [],
                    chartOptions: [],
                    subMainSection: [],
colValue: false,
                },
            ],
        }),
        [],
    );

    const renderContent = (content) => {
        return <div></div>;
    };

    return <SettingsLayout pageData={pageData} renderContent={renderContent} />;
};

export default AuditLog;
