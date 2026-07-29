import { db } from './index'
import {
    users,
    tickets,
    messages,
    teams,
    assignmentRules,
    automationRules,
    slaPolicies,
    customStatuses,
    savedAnswers,
    jointSessions,
    jointSessionMessages,
    jointSessionAgents,
    emailIntegrations,
} from './schema'
import bcrypt from 'bcryptjs'
import { sql } from 'drizzle-orm'

async function seed() {
    await db.execute(
        sql`TRUNCATE TABLE messages, tickets, users, assignment_rules, automation_rules, teams, sla_policies, custom_statuses, saved_answers, joint_session_messages, joint_session_agents, joint_sessions, email_integrations RESTART IDENTITY CASCADE`
    )

    const [supportTeam, engineeringTeam, financeTeam, productTeam] = await db
        .insert(teams)
        .values([
            { name: 'Support Team', description: 'Handles customer issues' },
            { name: 'Engineering Team', description: 'Technical problems' },
            { name: 'Finance Team', description: 'Billing issues' },
            { name: 'Product Team', description: 'Feature requests' },
        ])
        .returning()

    const hashedPassword = await bcrypt.hash('123456', 10)

    const [admin] = await db
        .insert(users)
        .values({
            name: 'Admin User',
            email: 'admin@desk.com',
            password: hashedPassword,
            role: 'admin',
        })
        .returning()

    const [manager] = await db
        .insert(users)
        .values({
            name: 'Sarah Manager',
            email: 'sarah@desk.com',
            password: hashedPassword,
            role: 'manager',
            teamId: supportTeam.id,
        })
        .returning()

    const [agent1] = await db
        .insert(users)
        .values({
            name: 'John Agent',
            email: 'john@desk.com',
            password: hashedPassword,
            role: 'agent',
            teamId: supportTeam.id,
        })
        .returning()

    const [agent2] = await db
        .insert(users)
        .values({
            name: 'Maria Agent',
            email: 'maria@desk.com',
            password: hashedPassword,
            role: 'agent',
            teamId: engineeringTeam.id,
        })
        .returning()

    const ticketsData = [
        {
            title: 'PC not turning on',
            description: 'My PC wont turn on since this morning',
            status: 'open' as const,
            priority: 'high' as const,
            category: 'Technical',
            createdById: admin.id,
            teamId: supportTeam.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
            updatedAt: new Date(Date.now() - 1000 * 60 * 30),
        },
        {
            title: 'Payment failed after checkout',
            description: 'I tried to pay but got gateway error',
            status: 'open' as const,
            priority: 'high' as const,
            category: 'Billing',
            createdById: agent1.id,
            teamId: financeTeam.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        },
        {
            title: 'Cannot reset password',
            description: 'Email with reset link not arriving',
            status: 'in_progress' as const,
            priority: 'medium' as const,
            category: 'Login',
            createdById: agent2.id,
            teamId: supportTeam.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
        },
        {
            title: 'Export to CSV wrong date',
            description: 'CSV export shows wrong date format',
            status: 'open' as const,
            priority: 'low' as const,
            category: 'General',
            createdById: manager.id,
            teamId: engineeringTeam.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
        },
        {
            title: 'Feature request dark mode',
            description: 'Would love dark mode in mobile app',
            status: 'closed' as const,
            priority: 'low' as const,
            category: 'General',
            createdById: agent1.id,
            teamId: productTeam.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
        },
        {
            title: 'API error 500 on login',
            description: 'Getting 500 error when trying to login via API',
            status: 'in_progress' as const,
            priority: 'high' as const,
            category: 'Technical',
            createdById: admin.id,
            teamId: engineeringTeam.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
        },
        {
            title: 'Invoice not received',
            description: 'I paid but did not receive invoice by email',
            status: 'open' as const,
            priority: 'medium' as const,
            category: 'Billing',
            createdById: agent2.id,
            teamId: financeTeam.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        },
        {
            title: 'App crashes on startup',
            description: 'Mobile app crashes immediately after opening',
            status: 'open' as const,
            priority: 'high' as const,
            category: 'Technical',
            createdById: agent1.id,
            teamId: engineeringTeam.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        },
        {
            title: 'Login page broken',
            description: 'Cannot login on mobile',
            status: 'open' as const,
            priority: 'high' as const,
            category: 'Technical',
            createdById: admin.id,
            teamId: engineeringTeam.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        },
        {
            title: 'Billing address wrong',
            description: 'My billing address is incorrect',
            status: 'open' as const,
            priority: 'medium' as const,
            category: 'Billing',
            createdById: agent1.id,
            teamId: financeTeam.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        },
        {
            title: 'Dark mode issue',
            description: 'Dark mode breaks layout',
            status: 'in_progress' as const,
            priority: 'low' as const,
            category: 'Technical',
            createdById: agent2.id,
            teamId: engineeringTeam.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
        },
        {
            title: 'Password change not working',
            description: 'Cannot change password',
            status: 'closed' as const,
            priority: 'medium' as const,
            category: 'Login',
            createdById: manager.id,
            teamId: supportTeam.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
        },
        {
            title: 'Export PDF broken',
            description: 'PDF export returns error',
            status: 'open' as const,
            priority: 'high' as const,
            category: 'Technical',
            createdById: admin.id,
            teamId: engineeringTeam.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        },
        {
            title: 'Subscription renewal failed',
            description: 'Auto-renewal did not work',
            status: 'open' as const,
            priority: 'high' as const,
            category: 'Billing',
            createdById: agent1.id,
            teamId: financeTeam.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        },
        {
            title: 'Notification not sending',
            description: 'Push notifications stopped',
            status: 'in_progress' as const,
            priority: 'medium' as const,
            category: 'Technical',
            createdById: agent2.id,
            teamId: engineeringTeam.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
        },
        {
            title: 'Account locked out',
            description: 'Too many failed login attempts',
            status: 'open' as const,
            priority: 'high' as const,
            category: 'Login',
            createdById: manager.id,
            teamId: supportTeam.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11),
        },
        {
            title: 'Search not working',
            description: 'Search returns no results',
            status: 'closed' as const,
            priority: 'low' as const,
            category: 'Technical',
            createdById: admin.id,
            teamId: engineeringTeam.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
        },
        {
            title: 'Wrong currency displayed',
            description: 'Price shown in wrong currency',
            status: 'open' as const,
            priority: 'medium' as const,
            category: 'Billing',
            createdById: agent1.id,
            teamId: financeTeam.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 19),
        },
    ]

    const createdTickets = await db.insert(tickets).values(ticketsData).returning()

    await db.insert(messages).values([
        { body: 'My PC wont turn on since this morning, tried everything', ticketId: createdTickets[0].id, authorId: admin.id },
        { body: 'Did you check the power cable?', ticketId: createdTickets[0].id, authorId: agent1.id },
        { body: 'Yes still not working, no lights at all', ticketId: createdTickets[0].id, authorId: admin.id },
        { body: 'Payment failed with gateway timeout error', ticketId: createdTickets[1].id, authorId: agent1.id },
        { body: 'Sorry for the issue. Can you share your order number?', ticketId: createdTickets[1].id, authorId: agent2.id },
        { body: 'Reset email not arriving even after 30 minutes', ticketId: createdTickets[2].id, authorId: agent2.id },
        { body: 'Please check your spam folder', ticketId: createdTickets[2].id, authorId: agent1.id },
        { body: 'Not in spam either', ticketId: createdTickets[2].id, authorId: agent2.id },
    ])

    await db.insert(assignmentRules).values([
        { name: 'Billing Issue → Finance Team', keywords: ['billing', 'invoice', 'payment'], teamId: financeTeam.id, isActive: true },
        { name: 'Technical Support → Engineering', keywords: ['error', 'bug', 'crash', 'api'], teamId: engineeringTeam.id, isActive: true },
        { name: 'Feature Requests → Product Team', keywords: ['feature', 'suggestion', 'enhancement'], teamId: productTeam.id, isActive: true },
    ])

    await db.insert(automationRules).values([
        {
            name: 'Auto-Close Resolved Tickets',
            description: 'Automatically close tickets resolved for 7 days',
            trigger: 'time_based',
            action: 'close_ticket',
            conditionHours: 168,
            isActive: true,
            executedCount: 234,
        },
        {
            name: 'Welcome Email for New Tickets',
            description: 'Send automated welcome email when a new ticket is created',
            trigger: 'new_ticket',
            action: 'send_email',
            isActive: true,
            executedCount: 2134,
        },
        {
            name: 'Priority Escalation',
            description: 'Escalate ticket priority if no response within 4 hours',
            trigger: 'time_based',
            action: 'change_priority',
            conditionHours: 4,
            isActive: true,
            executedCount: 432,
        },
    ])

    await db.insert(customStatuses).values([
        { label: 'Waiting for Customer', color: '#f59e0b', description: 'Awaiting reply from the customer', isActive: true },
        { label: 'On Hold', color: '#6b7280', description: 'Ticket is paused pending external action', isActive: true },
        { label: 'Escalated', color: '#ef4444', description: 'Ticket has been escalated to senior support', isActive: true },
        { label: 'Pending Review', color: '#6366f1', description: 'Waiting for internal review before closing', isActive: false },
    ])

    await db.insert(slaPolicies).values([
        { name: 'Critical Support', priority: 'high', firstResponseHours: 1, resolutionHours: 4, isActive: true },
        { name: 'Standard Support', priority: 'medium', firstResponseHours: 4, resolutionHours: 24, isActive: true },
        { name: 'Low Priority Support', priority: 'low', firstResponseHours: 8, resolutionHours: 72, isActive: false },
    ])

    await db.insert(savedAnswers).values([
        { title: 'Welcome Greeting', category: 'Greeting', body: 'Hello! Thank you for contacting our support team. My name is [Agent Name] and I will be happy to assist you today. Could you please provide more details about your issue?' },
        { title: 'Password Reset Instructions', category: 'Technical', body: 'To reset your password, please follow these steps:\n1. Go to the login page\n2. Click "Forgot Password"\n3. Enter your email address\n4. Check your inbox for the reset link\n5. Follow the instructions in the email.' },
        { title: 'Billing Inquiry Response', category: 'Billing', body: 'Thank you for reaching out about your billing concern. I understand how important this is to you. Could you please provide your account number or the email associated with your account so I can look into this right away?' },
        { title: 'Issue Escalation Notice', category: 'Escalation', body: 'I understand your frustration and I want to make sure this gets resolved as quickly as possible. I am escalating your ticket to our senior support team who specializes in this type of issue. You can expect a response within 2-4 hours.' },
        { title: 'Closing Message', category: 'Closing', body: "I am glad we could resolve your issue today! If you have any further questions or need assistance in the future, please don't hesitate to reach out. Have a wonderful day!" },
        { title: 'Refund Processing', category: 'Billing', body: 'I have initiated the refund process for your account. Please note that refunds typically take 5-7 business days to appear on your statement depending on your bank. You will receive a confirmation email shortly.' },
    ])
    console.log('✅ Saved answers created')

    await db.insert(emailIntegrations).values([
        {
            email: 'support@company.com',
            provider: 'Gmail',
            host: 'imap.gmail.com',
            port: 993,
            login: 'support@company.com',
            isActive: true,
            receivedToday: 68,
            sentToday: 45,
            lastSyncAt: new Date(Date.now() - 1000 * 60 * 2),
        },
        {
            email: 'billing@company.com',
            provider: 'Outlook',
            host: 'outlook.office365.com',
            port: 993,
            login: 'billing@company.com',
            isActive: true,
            receivedToday: 41,
            sentToday: 29,
            lastSyncAt: new Date(Date.now() - 1000 * 60 * 5),
        },
        {
            email: 'noreply@company.com',
            provider: 'SMTP',
            host: 'smtp.company.com',
            port: 587,
            login: 'noreply@company.com',
            isActive: false,
            receivedToday: 15,
            sentToday: 13,
            lastSyncAt: new Date(Date.now() - 1000 * 60 * 60),
        },
    ])
    console.log('✅ Email integrations created')

    const [session1] = await db.insert(jointSessions).values({ ticketId: createdTickets[2].id, isActive: true }).returning()
    const [session2] = await db.insert(jointSessions).values({ ticketId: createdTickets[5].id, isActive: true }).returning()
    const [session3] = await db.insert(jointSessions).values({ ticketId: createdTickets[7].id, isActive: true }).returning()
    const [session4] = await db.insert(jointSessions).values({ ticketId: createdTickets[0].id, isActive: true }).returning()

    await db.insert(jointSessionAgents).values([
        { sessionId: session1.id, userId: manager.id },
        { sessionId: session1.id, userId: agent1.id },
        { sessionId: session2.id, userId: agent2.id },
        { sessionId: session2.id, userId: admin.id },
        { sessionId: session3.id, userId: agent1.id },
        { sessionId: session3.id, userId: agent2.id },
        { sessionId: session3.id, userId: manager.id },
        { sessionId: session4.id, userId: manager.id },
    ])

    await db.insert(jointSessionMessages).values([
        { sessionId: session1.id, authorId: manager.id, body: 'I checked the email logs — the reset link was sent but might have expired.' },
        { sessionId: session1.id, authorId: agent1.id, body: 'Should I generate a new one manually?' },
        { sessionId: session1.id, authorId: manager.id, body: 'Yes, go ahead. Also ask the customer to check spam.' },
        { sessionId: session2.id, authorId: agent2.id, body: 'The error seems to be coming from the auth service. Checking logs now.' },
        { sessionId: session2.id, authorId: admin.id, body: 'I see it too — looks like a DB connection timeout. Restarting the pool.' },
        { sessionId: session3.id, authorId: agent1.id, body: 'Customer sent a crash report. It is related to the new build pushed yesterday.' },
        { sessionId: session3.id, authorId: agent2.id, body: 'Confirmed. Rolling back the build now.' },
        { sessionId: session3.id, authorId: manager.id, body: 'Good catch. Let the customer know we identified the issue.' },
        { sessionId: session4.id, authorId: manager.id, body: 'Just picked this up. Asking the customer for more details.' },
    ])

    console.log('✅ Joint sessions created')

    process.exit(0)
}

seed().catch((err) => {
    console.error(err)
    process.exit(1)
})