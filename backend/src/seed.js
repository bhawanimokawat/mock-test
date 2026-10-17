
require("dotenv").config();

const pool = require("./config/db");

const seedQuestions = async () => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const passageResult = await client.query(
            `SELECT id FROM passages
             WHERE title = $1
             FOR UPDATE`,
            ["Digital Marketing in the Modern Business World"]
        );

        if (passageResult.rows.length !== 1) {
            throw new Error(
                "Digital Marketing passage not found or title is not unique."
            );
        }

        const passageId = passageResult.rows[0].id;

        const existing = await client.query(
            `SELECT COUNT(*)::INTEGER AS count
             FROM questions
             WHERE passage_id = $1`,
            [passageId]
        );

        if (existing.rows[0].count > 0) {
            throw new Error(
                "Questions already exist for this passage. Seed cancelled."
            );
        }

        const questions = [
            // 10 MCQs
            {
                text: "What is digital marketing?",
                type: "mcq",
                options: [
                    "Promoting products or services through digital channels",
                    "Selling products only in physical shops",
                    "Manufacturing electronic devices",
                    "Delivering only printed advertisements"
                ],
                answer: "Promoting products or services through digital channels",
                marks: 1
            },
            {
                text: "What does SEO stand for?",
                type: "mcq",
                options: [
                    "Search Engine Optimization",
                    "Social Email Operation",
                    "Sales Engagement Office",
                    "Search Equipment Organization"
                ],
                answer: "Search Engine Optimization",
                marks: 1
            },
            {
                text: "What is one main purpose of SEO?",
                type: "mcq",
                options: [
                    "Improve visibility in search results",
                    "Increase product manufacturing costs",
                    "Replace all social media platforms",
                    "Prevent customers from finding websites"
                ],
                answer: "Improve visibility in search results",
                marks: 1
            },
            {
                text: "Which is an example of content marketing?",
                type: "mcq",
                options: [
                    "Publishing useful articles and videos",
                    "Repairing computer hardware",
                    "Delivering physical packages only",
                    "Changing a company's office furniture"
                ],
                answer: "Publishing useful articles and videos",
                marks: 1
            },
            {
                text: "What is a common purpose of email marketing?",
                type: "mcq",
                options: [
                    "Share updates and offers with subscribers",
                    "Improve road conditions",
                    "Manufacture computer processors",
                    "Replace every website"
                ],
                answer: "Share updates and offers with subscribers",
                marks: 1
            },
            {
                text: "What does a click measure?",
                type: "mcq",
                options: [
                    "An interaction with a link or advertisement",
                    "The total number of employees",
                    "The weight of a product",
                    "The number of office rooms"
                ],
                answer: "An interaction with a link or advertisement",
                marks: 1
            },
            {
                text: "What is a conversion?",
                type: "mcq",
                options: [
                    "A desired action completed by a user",
                    "A computer shutting down",
                    "A website changing its colour",
                    "An advertisement being designed but never shown"
                ],
                answer: "A desired action completed by a user",
                marks: 1
            },
            {
                text: "What does customer acquisition cost (CAC) measure?",
                type: "mcq",
                options: [
                    "The cost of acquiring a customer",
                    "The number of website images",
                    "The length of an email",
                    "The number of social media posts"
                ],
                answer: "The cost of acquiring a customer",
                marks: 1
            },
            {
                text: "What does ROAS help marketers evaluate?",
                type: "mcq",
                options: [
                    "Revenue generated relative to advertising spend",
                    "The number of employees in a company",
                    "The physical size of a product",
                    "The speed of a computer keyboard"
                ],
                answer: "Revenue generated relative to advertising spend",
                marks: 1
            },
            {
                text: "Which practice is important for ethical digital marketing?",
                type: "mcq",
                options: [
                    "Respecting privacy and obtaining appropriate consent",
                    "Sending unwanted messages to everyone",
                    "Making false claims about products",
                    "Collecting personal data without permission"
                ],
                answer: "Respecting privacy and obtaining appropriate consent",
                marks: 1
            },

            // 5 Fill in the blanks
            {
                text: "SEO stands for Search Engine ______.",
                type: "fill_blank",
                answer: "optimization",
                marks: 1
            },
            {
                text: "Social media marketing helps businesses connect with their ______.",
                type: "fill_blank",
                answer: "audience",
                marks: 1
            },
            {
                text: "Publishing useful articles and videos is an example of content ______.",
                type: "fill_blank",
                answer: "marketing",
                marks: 1
            },
            {
                text: "The cost of acquiring a customer is commonly abbreviated as ______.",
                type: "fill_blank",
                answer: "CAC",
                marks: 1
            },
            {
                text: "Revenue relative to advertising spend can be evaluated using ______.",
                type: "fill_blank",
                answer: "ROAS",
                marks: 1
            },

            // 5 True/False
            {
                text: "Digital marketing can use search engines and social media.",
                type: "true_false",
                answer: "true",
                marks: 1
            },
            {
                text: "SEO is intended to reduce a website's visibility in search results.",
                type: "true_false",
                answer: "false",
                marks: 1
            },
            {
                text: "Email marketing can share updates and offers with subscribers.",
                type: "true_false",
                answer: "true",
                marks: 1
            },
            {
                text: "Impressions and clicks always measure exactly the same thing.",
                type: "true_false",
                answer: "false",
                marks: 1
            },
            {
                text: "Marketers should respect customer privacy and use data responsibly.",
                type: "true_false",
                answer: "true",
                marks: 1
            },

            // 6 short answers: 2 marks each
            {
                text: "Explain digital marketing and give two examples of its channels.",
                type: "short_answer",
                answer: "Digital marketing promotes products or services through digital channels. Examples include search engines, social media, email, websites, and online advertisements.",
                rubric: "Award 1 mark for explaining promotion through digital channels and 1 mark for giving relevant examples. Accept equivalent wording and minor spelling or grammar errors.",
                marks: 2
            },
            {
                text: "What is SEO, and why is it useful for a business?",
                type: "short_answer",
                answer: "SEO improves a website's visibility in search engine results, helping potential customers discover the business.",
                rubric: "Award 1 mark for explaining search engine optimization or improving search visibility and 1 mark for explaining how it helps people discover the business. Accept equivalent meaning.",
                marks: 2
            },
            {
                text: "How can content marketing help a business build trust?",
                type: "short_answer",
                answer: "Useful articles, videos, and guides provide value to an audience, answer questions, and help build trust in a business.",
                rubric: "Award 1 mark for explaining that content provides useful information or answers questions and 1 mark for explaining trust, engagement, or customer relationships. Accept equivalent meaning.",
                marks: 2
            },
            {
                text: "Explain the difference between impressions and clicks.",
                type: "short_answer",
                answer: "Impressions count how many times content or an advertisement is displayed, while clicks count interactions with it.",
                rubric: "Award 1 mark for correctly explaining impressions and 1 mark for correctly explaining clicks. Accept equivalent wording.",
                marks: 2
            },
            {
                text: "What are CAC and ROAS, and what do they help marketers understand?",
                type: "short_answer",
                answer: "CAC measures the cost of acquiring a customer. ROAS measures revenue generated relative to advertising spend.",
                rubric: "Award 1 mark for correctly explaining CAC and 1 mark for correctly explaining ROAS. Accept clear equivalent definitions.",
                marks: 2
            },
            {
                text: "Why should businesses respect privacy when collecting customer data?",
                type: "short_answer",
                answer: "Respecting privacy protects customer information, supports trust, and helps businesses use data responsibly with appropriate consent.",
                rubric: "Award 1 mark for explaining protection of personal information and 1 mark for explaining consent, responsible use, or customer trust. Accept equivalent meaning.",
                marks: 2
            }
        ];

        if (questions.length !== 26) {
            throw new Error(
                `Expected 26 questions, found ${questions.length}.`
            );
        }

        for (let index = 0; index < questions.length; index++) {
            const question = questions[index];

            await client.query(
                `INSERT INTO questions
                    (passage_id, question_text, question_type, options,
                     correct_answer, max_marks, ai_rubric, question_order)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [
                    passageId,
                    question.text,
                    question.type,
                    question.options
                        ? JSON.stringify(question.options)
                        : null,
                    question.answer,
                    question.marks,
                    question.rubric || null,
                    index + 1
                ]
            );
        }

        await client.query("COMMIT");

        console.log(
            `Successfully inserted ${questions.length} Digital Marketing questions.`
        );
        console.log("Expected maximum score: 32 marks.");
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

seedQuestions()
    .catch((error) => {
        console.error("Question seeding failed:", error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await pool.end();
    });
