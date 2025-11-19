# RAG System Evaluation Guide

## Overview

This guide explains how to evaluate the Business Intelligence Suite RAG system using the provided test set and scoring methodology.

---

## Prerequisites

- Business Intelligence Suite running locally or deployed
- 30-question test set (`evaluation_test_set.csv`)
- Scoring sheet template (`evaluation_scoring_sheet.csv`)
- Test documents uploaded to the system (~150 pages of business contracts/reports)

---

## Step 1: Prepare Test Documents

**Upload the following to your RAG system:**

1. Business contracts (5 documents)
2. Financial reports (3 documents)
3. Policy documents (2 documents)
4. Total: ~150 pages, ~8.7 MB

**Ensure all documents are processed successfully before starting evaluation.**

---

## Step 2: Run Test Questions

**For each of the 30 questions in `evaluation_test_set.csv`:**

1. Copy the question from the CSV
2. Paste it into the Workspace Q&A interface
3. Submit the question
4. Record the system's response verbatim
5. Note whether sources were cited
6. Copy the complete response into the `app_answer` column

**Example workflow:**
```
Question: "What are the payment terms?"
System Response: "Payment terms are Net 30 days from invoice date [Source: Service_Agreement.pdf, Page 3]."
→ Record in CSV row 1, column 'app_answer'
```

---

## Step 3: Score Each Response

**For each question, evaluate and score:**

### 1. has_answer (0 or 1)
- **1** = System provided an answer
- **0** = System declined to answer or said "not in documents"

### 2. answer_correct (0, 0.5, or 1)
- **1.0** = Answer is accurate and complete
- **0.5** = Answer is partially correct or missing details
- **0.0** = Answer is wrong, irrelevant, or hallucinated

**Compare against expected_keywords in the test set**

### 3. cited_sources (0 or 1)
- **1** = Response includes citation in format [Source: doc.pdf, Page X]
- **0** = No citation provided

### 4. source_correct (0 or 1)
- **1** = Cited document is correct and page number is reasonable
- **0** = Wrong document cited or no sources provided

### 5. Calculate final_score
```
final_score = (answer_correct + source_correct) / 2
```

**Example:**
```
Question: "What are the payment terms?"
Answer: "Net 30 days [Source: Service_Agreement.pdf, Page 3]"

has_answer = 1 (answered)
answer_correct = 1.0 (accurate)
cited_sources = 1 (yes)
source_correct = 1 (correct document)
final_score = (1.0 + 1.0) / 2 = 1.0
```

---

## Step 4: Calculate Metrics

### Response Rate
```
Response Rate = (COUNT of has_answer = 1) / 30 × 100
```

**Target: 80-90%**

### Citation Rate
```
Citation Rate = (COUNT of cited_sources = 1) / 30 × 100
```

**Target: 100% (every answer should cite sources)**

### Average Accuracy
```
Average Accuracy = (SUM of answer_correct) / 30 × 100
```

**Target: 70-85%**

### Average Score
```
Average Score = (SUM of final_score) / 30 × 100
```

**Target: 60-75%**

### Hallucination Rate
```
Hallucination Rate = (COUNT of wrong answers that cited wrong sources) / 30 × 100
```

**Target: 0% (critical for business applications)**

---

## Step 5: Analyze Results by Category

**Break down performance by question category:**

1. **Financial** - Questions 1, 2, 5, 7, 11
2. **Legal** - Questions 3, 4, 6, 8, 9, 10, 13, 14, 15, 16, 18, 20, 23, 25, 26, 27, 28, 29, 30
3. **Business** - Questions 12, 17, 19, 22, 24
4. **Technical** - Question 21

**Calculate average score per category to identify strengths and weaknesses.**

---

## Step 6: Identify Improvement Areas

### Common Issues to Check:

**Multi-Document Synthesis**
- Questions requiring comparison across documents
- Expected lower performance (50-60% is acceptable)

**Complex Legal Analysis**
- Multi-clause interpretation
- Nuanced legal reasoning

**Unanswerable Questions**
- System should say "not in documents" for info not present
- This is CORRECT behavior, not a failure

---

## Scoring Best Practices

### Do:
✅ Compare answers against source documents
✅ Verify page numbers are reasonable
✅ Give partial credit (0.5) for incomplete but accurate answers
✅ Score "not in documents" as CORRECT if info isn't present
✅ Check that citations reference correct documents

### Don't:
❌ Expect perfection on multi-document synthesis
❌ Penalize "not in documents" responses if accurate
❌ Accept answers without citations
❌ Ignore hallucinations (fabricated information)

---

## Expected Results

### Industry Standards
- Response Rate: 80-90%
- Citation Rate: 40-60%
- Hallucination Rate: 10-30%
- Average Score: 60-70%

### Our System Targets
- Response Rate: 83%+
- Citation Rate: 100%
- Hallucination Rate: 0%
- Average Score: 62%+

---

## Reporting Results

**Create a summary report including:**

1. **Overall Metrics**
   - Response Rate
   - Citation Rate
   - Average Score
   - Hallucination Rate

2. **Performance by Category**
   - Bar chart showing accuracy per category
   - Identification of strengths and weaknesses

3. **Notable Findings**
   - Questions the system handled exceptionally well
   - Questions that were declined (and why)
   - Any hallucinations or errors

4. **Recommendations**
   - Specific improvements based on results
   - Next steps for optimization

---

## Files Included

1. **evaluation_test_set.csv** - 30 questions with expected keywords
2. **evaluation_scoring_sheet.csv** - Template for recording results
3. **EVALUATION_RESULTS.md** - Example completed evaluation
4. This guide - How to run evaluation

---

## Questions?

For questions about the evaluation methodology or scoring, refer to:
- EVALUATION_RESULTS.md (example completed evaluation)
- Documentation page in the app
- Contact: Courtney Kingsbury

---

**Last Updated:** November 2025
**Version:** 1.0
