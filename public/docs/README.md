# Evaluation Documentation Files

This directory contains the evaluation results and test data for the Business Intelligence Suite RAG system.

## Files to Upload

To enable the download links on the Documentation page, upload the following files to this directory:

### Required Files:

1. **evaluation_test_set.csv**
   - The 30-question test set used for evaluation
   - Should include columns: question_id, category, question, expected_answer
   - CSV format with headers

2. **evaluation_scoring_sheet.csv**
   - Detailed scoring results for each question
   - Should include: question_id, question, answer_accuracy, source_accuracy, final_score, notes
   - CSV format with headers

3. **EVALUATION_GUIDE.md**
   - Markdown file explaining the evaluation methodology
   - Instructions for replicating the evaluation
   - Scoring rubric and guidelines

### Optional Files:

4. **evaluation_results.pdf**
   - Comprehensive PDF documentation of the evaluation results
   - Can be generated from the /documentation page or uploaded separately

## Current Status

Upload your evaluation files here to enable the download functionality on the Documentation page.

The download links are configured at:
- `/docs/evaluation_test_set.csv`
- `/docs/evaluation_scoring_sheet.csv`
- `/docs/EVALUATION_GUIDE.md`
- `/docs/evaluation_results.pdf`
