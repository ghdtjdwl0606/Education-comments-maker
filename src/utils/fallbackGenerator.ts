import { StudentInput, GeneratedCommentResponse, ToneOption, HomeworkStatus } from '../types';

export function generateRuleBasedComment(student: StudentInput): GeneratedCommentResponse {
  const name = student.name.trim() || 'The student';
  const pronoun = student.pronoun === 'he' ? { subj: 'He', obj: 'him', poss: 'his', be: 'is', has: 'has' }
                : student.pronoun === 'she' ? { subj: 'She', obj: 'her', poss: 'her', be: 'is', has: 'has' }
                : { subj: name, obj: name, poss: `${name}'s`, be: 'is', has: 'has' };

  const keywords = student.keywords.length > 0 
    ? student.keywords.map(k => k.trim()) 
    : ['active participation', 'positive attitude'];

  const tone = student.tone || 'encouraging';
  const hw = student.homeworkStatus || 'good';
  const vScore = student.vocabScore ?? 85;

  // 1. Overall Comment Assembly based on Tone & Keywords
  let intro = '';
  let body = '';
  let hwVocabIntegration = '';
  let conclusion = '';
  let alt1 = '';
  let alt2 = '';

  const kwList = keywords.join(', ');

  switch (tone) {
    case 'encouraging':
      intro = `${name} has shown heartwarming commitment and enthusiasm in English class this term.`;
      body = `Throughout our sessions, ${pronoun.subj} has consistently displayed ${kwList}, bringing wonderful energy to group discussions and daily learning.`;
      if (vScore >= 90 && (hw === 'perfect' || hw === 'good')) {
        hwVocabIntegration = `${pronoun.poss.charAt(0).toUpperCase() + pronoun.poss.slice(1)} diligent study habits are clearly reflected in outstanding vocabulary scores and reliable homework completion.`;
      } else if (vScore < 70) {
        hwVocabIntegration = `While mastering new vocabulary requires ongoing practice, ${pronoun.poss} positive mindset and willingness to try are truly inspiring.`;
      } else {
        hwVocabIntegration = `${pronoun.subj} continues to make steady, meaningful strides in expanding language competence.`;
      }
      conclusion = `With continued encouragement, I am confident ${pronoun.subj.toLowerCase()} will continue to flourish and build lasting confidence in English.`;
      
      alt1 = `It is a genuine pleasure teaching ${name}, who approaches English lessons with curiosity and a commendable focus on ${kwList}. With steady guidance, ${pronoun.subj.toLowerCase()} will reach even greater heights.`;
      alt2 = `${name} is an earnest learner whose dedication to ${kwList} makes our classroom a brighter place. Keep up the fantastic effort!`;
      break;

    case 'academic':
      intro = `${name} demonstrates solid academic progress and consistent engagement across core English competencies.`;
      body = `In class assessments and collaborative activities, ${pronoun.subj.toLowerCase()} has evidenced notable proficiency in ${kwList}.`;
      if (vScore >= 90) {
        hwVocabIntegration = `${pronoun.poss.charAt(0).toUpperCase() + pronoun.poss.slice(1)} vocabulary retention remains at an exemplary standard (${vScore}%), demonstrating disciplined pre-lesson preparation.`;
      } else if (vScore < 70) {
        hwVocabIntegration = `Systematic vocabulary reinforcement is recommended to further strengthen lexical accuracy and reading comprehension.`;
      } else {
        hwVocabIntegration = `Performance on vocabulary evaluations is satisfactory, reflecting an expanding linguistic repertoire.`;
      }
      conclusion = `Maintaining regular review schedules and targeted writing practice will support continued academic advancement.`;

      alt1 = `${name} continues to meet curriculum benchmarks with commendable focus on ${kwList}. Continued attention to lexical precision and assignment timelines will solidify these gains.`;
      alt2 = `An analytical evaluation of ${name}'s coursework reveals commendable application of ${kwList}, alongside reliable foundational language skills.`;
      break;

    case 'constructive':
      intro = `${name} possesses tremendous potential and has exhibited meaningful moments of growth this semester.`;
      body = `We have observed positive contributions in areas such as ${kwList}, which provide a strong basis for further development.`;
      if (hw === 'inconsistent' || hw === 'poor') {
        hwVocabIntegration = `To maximize learning outcomes, establishing a more structured routine for timely homework submission is essential.`;
      } else if (vScore < 75) {
        hwVocabIntegration = `Dedicating 15 minutes of spaced repetition to daily vocabulary review will significantly elevate test scores and retention.`;
      } else {
        hwVocabIntegration = `Channeling ${pronoun.poss} current momentum into more complex sentence construction and proactive speaking will yield great results.`;
      }
      conclusion = `By setting clear weekly milestones and staying focused on consistent execution, ${name} will unlock higher levels of proficiency.`;

      alt1 = `${name} has the aptitude to excel in English, particularly when applying ${kwList}. Focusing on daily homework discipline and targeted word memorization will accelerate progress.`;
      alt2 = `While ${name} demonstrates strength in ${kwList}, consistent follow-through on assignments will help translate understanding into sustained academic mastery.`;
      break;

    case 'enthusiastic':
      intro = `${name} is a stellar presence in our classroom, radiating curiosity and excitement for English!`;
      body = `It has been incredible watching ${pronoun.obj} demonstrate ${kwList} during every single activity!`;
      if (vScore >= 85) {
        hwVocabIntegration = `Scoring an impressive ${vScore}% on vocabulary tests and tackling homework with such diligence is truly commendable!`;
      } else {
        hwVocabIntegration = `${pronoun.poss.charAt(0).toUpperCase() + pronoun.poss.slice(1)} energetic attitude and grit turn every challenge into an opportunity to learn!`;
      }
      conclusion = `Bravo, ${name}! Keep shining brightly and reaching for the stars!`;

      alt1 = `Superb work this term, ${name}! Your passion for ${kwList} inspires everyone around you. Keep up this magnificent energy!`;
      alt2 = `${name} brings contagious enthusiasm to English class! Your continuous growth in ${kwList} is something to be immensely proud of!`;
      break;

    case 'diplomatic':
      intro = `We are pleased to share ${name}'s progress report for this evaluation period.`;
      body = `${name} has shown a respectful demeanor and active engagement, notably demonstrating ${kwList}.`;
      if (hw === 'perfect' || hw === 'good') {
        hwVocabIntegration = `Homework has been completed faithfully, supporting strong performance on regular vocabulary evaluations (${vScore}%).`;
      } else {
        hwVocabIntegration = `With parental partnership in encouraging daily homework completion, we expect to see even stronger test performance in the coming weeks.`;
      }
      conclusion = `Thank you for your ongoing support at home as we partner together in nurturing ${name}'s English language journey.`;

      alt1 = `${name} continues to be a polite and attentive student who demonstrates admirable effort in ${kwList}. We appreciate your warm encouragement at home.`;
      alt2 = `It is our privilege to guide ${name}'s English education. ${pronoun.subj} exhibits commendable growth in ${kwList}, and with continued home study habits, will achieve great success.`;
      break;

    case 'concise':
      intro = `${name} has demonstrated commendable engagement, highlighting strengths in ${kwList}.`;
      body = `Homework adherence is ${hw === 'perfect' ? 'exceptional' : hw === 'good' ? 'consistent' : 'developing'}, with vocabulary scores averaging ${vScore}%.`;
      hwVocabIntegration = '';
      conclusion = `Continued daily practice is recommended for sustained growth.`;

      alt1 = `${name} shows consistent effort in ${kwList}. Vocabulary performance (${vScore}%) remains strong with regular assignment completion.`;
      alt2 = `Demonstrating positive application of ${kwList}, ${name} is encouraged to maintain current study habits and homework discipline.`;
      break;
  }

  // Adjust for length option
  let overallComment = '';
  if (student.length === 'short') {
    overallComment = `${intro} ${body}`;
  } else if (student.length === 'medium') {
    overallComment = `${intro} ${body} ${hwVocabIntegration} ${conclusion}`.replace(/\s+/g, ' ').trim();
  } else {
    // detailed
    const noteText = student.customNote ? ` Furthermore, ${student.customNote}.` : '';
    overallComment = `${intro} ${body} ${hwVocabIntegration}${noteText} In summary, ${conclusion}`.replace(/\s+/g, ' ').trim();
  }

  // 2. Specific Homework Feedback
  let homeworkFeedback = '';
  switch (hw) {
    case 'perfect':
      homeworkFeedback = `Always submits homework meticulously and ahead of time, showing exemplary responsibility.`;
      break;
    case 'good':
      homeworkFeedback = `Homework is consistently completed with good effort; minor errors are promptly reviewed and corrected.`;
      break;
    case 'inconsistent':
      homeworkFeedback = `Occasional late submissions or incomplete sections noted; establishing a regular evening study slot will help maintain consistency.`;
      break;
    case 'poor':
      homeworkFeedback = `Homework completion requires urgent attention and regular parental monitoring to ensure key curriculum points are reinforced.`;
      break;
  }

  // 3. Specific Vocab Feedback
  let vocabFeedback = '';
  if (vScore >= 95) {
    vocabFeedback = `Outstanding vocabulary mastery (${vScore}%). Demonstrates deep word retention and accurately applies words in context.`;
  } else if (vScore >= 80) {
    vocabFeedback = `Solid vocabulary test performance (${vScore}%). Shows strong understanding of core terms with minor spelling review needed.`;
  } else if (vScore >= 65) {
    vocabFeedback = `Moderate vocabulary score (${vScore}%). Recommended to utilize flashcards or spaced repetition for challenging word lists.`;
  } else {
    vocabFeedback = `Vocabulary score (${vScore}%) indicates a need for structured re-testing and daily 10-word incremental review.`;
  }

  // 4. Actionable Goals
  let actionableGoals = '';
  if (vScore >= 85 && (hw === 'perfect' || hw === 'good')) {
    actionableGoals = `Next Goal: Expand into advanced reading passages and incorporate newly learned idioms into expressive writing.`;
  } else if (hw === 'inconsistent' || hw === 'poor') {
    actionableGoals = `Next Goal: Submit 100% of weekly workbook assignments on time and review mistakes within 24 hours.`;
  } else {
    actionableGoals = `Next Goal: Focus on consistent daily vocabulary memorization (15 mins) and active participation in class speaking drills.`;
  }

  // 5. Korean Summary for parents/teachers
  const toneKoMap: Record<ToneOption, string> = {
    encouraging: '따뜻하고 격려하는 어조',
    academic: '전문적·학업 중심 어조',
    constructive: '성장 중심·건설적 조언 어조',
    enthusiastic: '열정적·칭찬 가득한 어조',
    diplomatic: '학부모 전달용 정중한 어조',
    concise: '핵심 요약형 어조',
  };

  const koreanSummary = `[학부모 전달 요약 / ${toneKoMap[tone]}] ${name} 학생은 수업 중 [${kwList}] 측면에서 두드러진 참여와 성장을 보였습니다. 단어시험 결과(${vScore}점) 및 숙제 수행도(${hw === 'perfect' ? '완벽' : hw === 'good' ? '우수' : '보충 필요'})를 반영하여 긍정적인 성취를 격려하고, 앞으로의 실력 향상을 위한 맞춤형 학습 조언을 제공합니다.`;

  return {
    overallComment,
    homeworkFeedback,
    vocabFeedback,
    actionableGoals,
    koreanSummary,
    alternativePhrasings: [alt1, alt2],
  };
}
